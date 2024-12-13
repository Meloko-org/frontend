import React, { useEffect, useState } from "react";
import { useSelector, UseSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, View, ActivityIndicator } from "react-native";
import TextHeading3 from "../components/utils/texts/Heading3";
import ButtonBack from "../components/utils/buttons/Back";
import { OrderData, ProductData } from "../types/API";

import { useNavigation } from "@react-navigation/native";
import TextHeading4 from "../components/utils/texts/Heading4";
import OrderStatus from "../components/cards/OrderStatus";
import TextBody1 from "../components/utils/texts/Body1";
import CardProduct from "../components/cards/Product";

import productsTools from "../modules/productsTools";
import orderTools from "../modules/orderTools";
import OrderProductCard from "../components/cards/OrderProductCard";
import Custom from "../components/utils/buttons/Custom";
import { ShopState } from "../reducers/shop";
import TextBody2 from "../components/utils/texts/Body2";
import Spinner from "../components/utils/Spinner";
import BackLabelButton from "../components/utils/buttons/BackLabel";

type OrderDetailsProps = {
  route: Route;
};

type Route = {
  params: Params;
};

type Params = {
  orderId: string;
};

export default function OrderDetailsScreen({ route }: OrderDetailsProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const navigation = useNavigation();
  const orderId = route.params.orderId;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderData | undefined>();
  const [products, setProducts] = useState<string[]>([]);
  const [subOrderId, setSubOrderId] = useState<string | undefined>();
  const [withdrawMarket, setWithdrawMarket] = useState<string>();
  const [withdrawDay, setWithdrawDay] = useState<string>();

  const [status, setStatus] = useState<
    "pending" | "validated" | "withdrawn" | "canceled"
  >("pending");
  const [canceledProducts, setCanceledProducts] = useState<string[]>([]);

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const orderPromise = await orderTools.getOrderDetailsById(token, orderId);
      setOrder(orderPromise);
      // mise à jour du status
      const shopDetails = orderPromise.details.find(
        (detail: string) => detail.shop === shopStore._id,
      );
      setStatus(shopDetails.status);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsFromOrder = (order: string, shopId: string) => {
    const shopDetails = order.details.find((detail) => detail.shop === shopId);

    if (!shopDetails) {
      console.warn(`no details found for shop ID: ${shopId}`);
      setProducts([]);
      return;
    }

    if (shopDetails.withdrawMode === "market") {
      setWithdrawMarket(shopDetails.withdrawMarket);
      setWithdrawDay(weekDays[shopDetails.withdrawDay]);
    }

    console.log("      --> FONCTION getproduct");
    console.log("      -->  status :", shopDetails.status);

    const orderProductsCards = shopDetails.products.map((product) => (
      <OrderProductCard
        key={product._id}
        orderProductData={product}
        extraClasses="mb-3"
        onPressFn={handleCanceledProducts}
        status={shopDetails.status}
      />
    ));

    setProducts(orderProductsCards);

    setSubOrderId(shopDetails._id);
    console.log(`   -->  subOrderId for shop ${shopId} - ${shopDetails._id}`);
  };

  useEffect(() => {
    setOrder(undefined);
    setProducts([]);
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && shopStore) {
      getProductsFromOrder(order, shopStore._id);
    }
  }, [order, shopStore]);

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      // mise à jour de details
      const updatedDetails = order?.details.map((detail) => {
        if (detail.shop === shopStore._id) {
          return {
            ...detail,
            status: "canceled",
          };
        }
        return detail;
      });
      // mise à jour de l'order
      const updatedOrder = {
        ...order,
        details: updatedDetails,
      };
      setOrder(updatedOrder);
      // envoyer order au backend
      const values = { order: updatedOrder, status: "canceled" };
      const token = await getToken();
      const response = await orderTools.validateOrder(token, values, orderId);

      Alert.alert("Status de la commande", response.message);

      if (response.result) {
        setStatus("canceled");
        setIsLoading(false);
        // navigation.navigate("TabNavigatorProducer", {
        //   screen: "Sales"
        // })
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidateOrder = async () => {
    try {
      setIsLoading(true);
      // ajouter la logique pour valider la commande en bdd
      const shopDetails = order?.details.find(
        (detail) => detail.shop === shopStore._id,
      );
      // mise à jour de chaque produit
      const updatedProducts = shopDetails?.products.map((product) => {
        if (!canceledProducts.includes(product.product._id)) {
          return {
            ...product,
            isConfirmed: true,
          };
        } else {
          return product;
        }
      });
      // mise à jour de details
      const updatedDetails = order?.details.map((detail) => {
        if (detail.shop === shopStore._id) {
          return {
            ...detail,
            products: updatedProducts,
            status: "validated",
          };
        }
        return detail;
      });
      // mise à jour de l'order
      const updatedOrder = {
        ...order,
        details: updatedDetails,
      };
      setOrder(updatedOrder);
      // envoyer order au backend
      const values = { order: updatedOrder, status: "validated" };
      const token = await getToken();
      const response = await orderTools.validateOrder(token, values, orderId);

      Alert.alert("Status de la commande", response.message);

      if (response.result) {
        setStatus("validated");
        setIsLoading(false);
        // navigation.navigate("TabNavigatorProducer", {
        //   screen: "Sales"
        // })
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreOrder = async () => {
    try {
      const shopDetails = order?.details.find(
        (detail) => detail.shop === shopStore._id,
      );

      const updatedProducts = shopDetails?.products.map((product) => {
        return {
          ...product,
          isConfirmed: false,
        };
      });

      const updatedDetails = order?.details.map((detail) => {
        if (detail.shop === shopStore._id) {
          return {
            ...detail,
            products: updatedProducts,
            status: "pending",
          };
        }
        return detail;
      });
      // mise à jour de l'order
      const updatedOrder = {
        ...order,
        details: updatedDetails,
      };
      setOrder(updatedOrder);
      // envoyer order au backend
      const values = { order: updatedOrder, status: "pending" };
      const token = await getToken();
      const response = await orderTools.validateOrder(token, values, orderId);

      Alert.alert("Status de la commande", response.message);

      if (response.result) {
        setStatus("pending");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCanceledProducts = (id: string) => {
    setCanceledProducts((prevState) => {
      const existingProduct = prevState?.find((product) => product === id);
      if (existingProduct) {
        return prevState?.filter((p) => p !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  console.log("   --> ORDERDETAILS");
  console.log("   -->  OrderDetailsScreen rendered");
  console.log("   -->  subOrderId :", subOrderId);
  console.log("   -->  status :", status);

  console.log("-----------------------------------------------------------");

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 pb-5"
      >
        <View className="flex flex-row mb-5 mt-3">
          <BackLabelButton
            onPressFn={() =>
              navigation.navigate("TabNavigatorProducer", { screen: "Sales" })
            }
            extraClasses="ml-5"
          >
            Retour aux commandes
          </BackLabelButton>
        </View>

        <View className="mb-3">
          <TextHeading3 centered>Détail commande</TextHeading3>
        </View>

        {isLoading ? (
          <Spinner />
        ) : (
          order && (
            <View className="px-3">
              <OrderStatus orderData={order} status={status} />

              {withdrawMarket && withdrawDay && (
                <View className="rounded-lg border bg-white dark:bg-tertiary p-2">
                  <View className="flex flex-row w-full items-center">
                    <View className="w-2/6">
                      <TextBody2>Place de marché :</TextBody2>
                    </View>
                    <View className="w-4/6">
                      <TextBody1>{withdrawMarket}</TextBody1>
                    </View>
                  </View>
                  <View className="flex flex-row w-full items-center">
                    <View className="w-2/6">
                      <TextBody2>Jour de retrait :</TextBody2>
                    </View>
                    <View className="w-4/6">
                      <TextBody1>{withdrawDay}</TextBody1>
                    </View>
                  </View>
                </View>
              )}

              <View className="mt-5 mb-2">
                <TextBody1 centered>Détail</TextBody1>
                <TextBody2 centered>
                  (Cliquez sur un produit pour l'annuler avant de valider)
                </TextBody2>
              </View>
              {products}

              <View className="flex-row justify-between items-center mt-5 mb-4">
                {status === "canceled" || status == "validated" ? (
                  <Custom
                    label={`METTRE LA COMMANDE EN ATTENTE`}
                    extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                    textClasses="text-lightbg font-bold text-lg"
                    onPressFn={handleRestoreOrder}
                    isLoading={isLoading}
                  />
                ) : (
                  <>
                    <Custom
                      label={`ANNULER LA\nCOMMANDE`}
                      extraClasses="bg-danger flex-1 mx-1 rounded-lg px-2 h-[80px]"
                      textClasses="text-lightbg font-bold text-lg"
                      onPressFn={handleCancelOrder}
                      isLoading={isLoading}
                    />
                    <Custom
                      label={`VALIDER`}
                      extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                      textClasses="text-lightbg font-bold text-lg"
                      onPressFn={handleValidateOrder}
                      isLoading={isLoading}
                    />
                  </>
                )}
              </View>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
