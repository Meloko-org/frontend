import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import { updateUser, UserState } from "../../../reducers/user";
import { CartState, emptyCart } from "../../../reducers/cart";

import { AddressData, UserAddressData, UserData } from "../../../types/API";
import userTools from "../../../modules/userTools";
import stripeTools from "../../../modules/stripeTools";

import { SheetManager } from "react-native-actions-sheet";

import { Alert } from "react-native";
import ButtonPrimaryEnd from "./PrimaryEnd";
import { formatCentsToEuros } from "../../../modules/globalTools";

type StripPaymentButtonProps = {
  label: string;
  iconName: string;
  firstname: string;
  lastname: string;
  billingAddress: UserAddressData;
  shippingAddress: UserAddressData;
  totalCartAmount: number;
  navigation: BottomTabNavigationProp<UserTabParamList>;
  disabled: boolean;
  extraClasses?: string;
};

export default function StripePaymentButton({
  label,
  iconName,
  firstname,
  lastname,
  billingAddress,
  shippingAddress,
  totalCartAmount,
  navigation,
  disabled,
  extraClasses,
}: StripPaymentButtonProps) {
  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;
  const { getToken } = useAuth();
  const [isPaymentScreenLoading, setIsPaymentScreenLoading] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const [publishableKey, setPublishableKey] = useState<string | undefined>("");

  const fetchPublishableKey = async () => {
    const key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  /* début du process de paiement */
  const openPaymentSheet = async () => {
    try {
      setIsPaymentScreenLoading(true);

      /*
        Si userStore ne contenait pas de lastname et de firstname, on commence par les 
        sauvegarder en base et mettre à jour le userStore
       */
      if (!userStore.firstname || !userStore.lastname) {
        const token = await getToken();
        const userResponse = await userTools.updateUser(token, {
          firstname: firstname,
          lastname: lastname,
        });

        if (userResponse.success && userResponse.data) {
          dispatch(updateUser(userResponse.data));
        } else {
          SheetManager.show("alert", {
            payload: {
              message: userResponse.message!,
              alertType: "error",
            },
          });
          setIsPaymentScreenLoading(false);
          return;
        }
      }

      /* envoi des données au backend */
      const order = await initializePaymentSheet();

      /* ouverture de l'UI Stripe */
      const { error } = await presentPaymentSheet();

      if (error) {
        SheetManager.show("alert", {
          payload: {
            message: `Error code: ${error.code} - ${error.message}`,
            alertType: "error",
          },
        });
        return;
      } else {
        dispatch(emptyCart());
        // await fetchData();
        navigation.jumpTo("OrderCustomer", {
          orderId: order._id,
        });
      }
    } catch (error: unknown) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Une erreur inconnue est survenue.";

      SheetManager.show("alert", {
        payload: {
          message:
            errorMessage || "Une erreur est survenue pendant le paiement.",
          alertType: "error",
        },
      });
    } finally {
      setIsPaymentScreenLoading(false);
    }
  };

  const initializePaymentSheet = async () => {
    try {
      /* envoie des données au backend */
      const {
        customerSessionClientSecret,
        paymentIntent,
        ephemeralKey,
        customer,
        order,
      } = await fetchPaymentSheetParams();

      /* appel initPaymentSheet du skd Stripe */
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Meloko SAS",
        customerId: customer,
        // customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        customerSessionClientSecret,
      });

      if (error) {
        throw new Error(
          `Erreur d'initialisation du paiement : ${error.message}`,
        );
      } else {
        setLoading(true);
      }

      return order;
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Une erreur inconnue est survenue.";

      SheetManager.show("alert", {
        payload: {
          message: errorMessage || "Impossible d'initialiser le paiement.",
          alertType: "error",
        },
      });
      throw error; // permet à openPaymentSheet de stopper le flux
    }
  };

  /* envoie des données au backend */
  const fetchPaymentSheetParams = async () => {
    const token = await getToken();

    const sessionResponse = await fetch(`${API_ROOT}/stripe/customer-session`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { customerSessionClientSecret } = await sessionResponse.json();

    const paymentResponse = await fetch(`${API_ROOT}/stripe/payment-sheet`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: totalCartAmount,
        billingAddress,
        shippingAddress,
        cart: cartStore,
      }),
    });

    /* Interception d'une erreur lors de la création du paiement */
    if (!paymentResponse.ok) {
      setIsPaymentScreenLoading(false);
      const errorData = await paymentResponse.json().catch(() => ({})); // sécurité
      const message =
        errorData.error ||
        "Une erreur est survenue pendant la préparation du paiement.";
      throw new Error(message);
    }

    console.log("fetchPaymentSheetParams ok");

    const { paymentIntent, ephemeralKey, customer, order } =
      await paymentResponse.json();

    return {
      customerSessionClientSecret,
      paymentIntent,
      ephemeralKey,
      customer,
      order,
    };
  };

  // pour mettre à jour les orders du client dans le userStore
  const fetchData = async () => {
    try {
      // store user's info in the store
      const token = await getToken();
      const userResponse = await userTools.getUserInfos(token);

      if (userResponse.success && userResponse.data) {
        dispatch(updateUser(userResponse.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(" ----------- STRIPE PAYMENT -------------------- ");
  console.log("cart amount :", totalCartAmount);

  return (
    <StripeProvider
      publishableKey={publishableKey!}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <ButtonPrimaryEnd
        disabled={disabled || isPaymentScreenLoading}
        label={`Payer ${formatCentsToEuros(totalCartAmount)}`}
        iconName={iconName}
        onPressFn={() => openPaymentSheet()}
        isLoading={isPaymentScreenLoading}
        extraClasses={extraClasses}
      />
    </StripeProvider>
  );
}
