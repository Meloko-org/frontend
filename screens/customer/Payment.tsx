import React, { useState, useEffect, JSX } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StripePaymentButton from "../../components/utils/buttons/StripePayment";
import InputText from "../../components/utils/inputs/Text";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import InputTextarea from "../../components/utils/inputs/Textarea";
import ButtonSecondaryStart from "../../components/utils/buttons/SecondaryStart";
import CartTools from "../../modules/CartTools";
import { CartState } from "../../reducers/cart";
import { UserState } from "../../reducers/user";
import TopBar from "../../components/TopBar";
import Address from "../../components/cards/Address";
import TextBody1 from "../../components/utils/texts/Body1";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import { UserAddressData } from "../../types/API";
import ButtonSecondaryEnd from "../../components/utils/buttons/SecondaryEnd";

type PaymentCustomerRouteProp = RouteProp<UserTabParamList, "PaymentCustomer">;

type PaymentCustomerNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "PaymentCustomer"
>;

type Props = {
  navigation: PaymentCustomerNavProp;
  route: PaymentCustomerRouteProp;
};

export default function PaymentCustomerScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const { from, backLabel, screenTitle } = route.params || [];

  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const [cartTotal, setCartTotal] = useState<number | undefined>(0);
  const [firstname, setFirstname] = useState<string>(userStore.firstname || "");
  const [lastname, setLastname] = useState<string>(userStore.lastname || "");
  const [billingAddress, setBillingAddress] = useState<
    UserAddressData | undefined
  >(undefined);

  // évolution future
  const [shippingAddress, setShippingAddress] = useState<
    UserAddressData | undefined
  >(undefined);

  useEffect(() => {
    const defaultAddress =
      userStore.addresses &&
      userStore.addresses.length > 0 &&
      userStore.addresses.find((adr) => adr.isDefault === true);

    if (defaultAddress) setBillingAddress(defaultAddress);
  }, []);

  useEffect(() => {
    let allShopsCost = CartTools.getCartTotal(cartStore);
    setCartTotal(allShopsCost);
  }, [cartStore]);

  console.log("------------- PAYMENTSCREEN ------------------------------");
  console.log(
    "cartStore :",
    JSON.stringify(
      cartStore.map((c) => c.products),
      null,
      2,
    ),
  );
  // console.log("cartStore user :", JSON.stringify(cartStore, null, 2))
  console.log("cartTotal :", cartTotal);

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      {/* TopBar */}
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour aux modes de retrait"}
          screen={from || "WithdrawModes"}
          label={screenTitle || "PAIEMENT"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 8.5 }} className="p-3">
        <TextHeading2 extraClasses="mb-3">Facturation</TextHeading2>
        <InputText
          value={firstname}
          onChangeText={(newFirstname: string) => setFirstname(newFirstname)}
          placeholder="Votre prénom"
          label="Prénom"
          autoCapitalize="none"
          extraClasses="w-full mb-2"
        />

        <InputText
          value={lastname}
          onChangeText={(newLastname: string) => setLastname(newLastname)}
          placeholder="Votre nom"
          label="Nom"
          autoCapitalize="none"
          extraClasses="w-full mb-5"
        />

        {billingAddress ? (
          <>
            <Address
              address={billingAddress}
              deletable={false}
              onPressFn={() => {}}
              extraClasses="mb-5"
            />
            <ButtonSecondaryEnd
              label={`Changer ou ajouter\nune adresse`}
              iconName="address-book"
              iconFamily="FontAwesomeIcon"
              onPressFn={() =>
                navigation.navigate("UserProfileAddresses", {
                  from: "PaymentCustomer",
                  backLabel: "Retour au paiement",
                  screenTitle: "CHANGER D'ADRESSE",
                  selectAddressFn: (selectedAddress) => {
                    console.log("youpi");
                    setBillingAddress(selectedAddress);
                    navigation.navigate("PaymentCustomer", {
                      from: "WithdrawModes",
                      backLabel: "Retour aux modes de retrait",
                      screenTitle: "PAIEMENT",
                    });
                  },
                })
              }
              extraClasses="h-20 mb-5"
            />
          </>
        ) : (
          <>
            <TextBody1
              centered
              extraClasses="mb-5"
            >{`vous n'avez pas encore\nd'adresse enregistrée.`}</TextBody1>
            <ButtonSecondaryEnd
              label="Créer une adresse"
              iconName="address-card"
              iconFamily="FontAwesomeIcon"
              onPressFn={() =>
                navigation.navigate("UserProfileAddresses", {
                  from: "PaymentCustomer",
                  backLabel: "Retour au paiement",
                  screenTitle: "CREER UNE ADRESSE",
                })
              }
            />
          </>
        )}
      </View>

      <View style={{ flex: 1.5 }} className="px-3">
        <StripePaymentButton
          label="Payer"
          iconName="credit-card"
          firstname={firstname}
          lastname={lastname}
          billingAddress={billingAddress!}
          shippingAddress={shippingAddress!}
          totalCartAmount={cartTotal}
          navigation={navigation}
          disabled={!firstname || !lastname || !billingAddress}
          extraClasses="h-14 mt-5 mb-3"
        />
      </View>
    </SafeAreaView>
  );
}
