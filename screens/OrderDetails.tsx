import React, { useEffect, useState } from "react";
import { useSelector, UseSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
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

    const orderProductsCards = shopDetails.products.map((product) => (
      <OrderProductCard
        key={product._id}
        orderProductData={product}
        extraClasses="mb-3"
      />
    ));

    setProducts(orderProductsCards);

    setSubOrderId(shopDetails._id);
    console.log(`subOrderId for shop ${shopId} - ${subOrderId}`);
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

  const handleCancelOrder = async () => {};

  console.log("OrderDetailsScreen rendered");
  // console.log("route orderId :", route.params.orderId);
  // console.log("subOrderId :", subOrderId);
  // console.log("order: ", JSON.stringify(order, null, 2));
  // console.log("withdrawMarket: ", withdrawMarket)

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3 pb-5"
      >
        <View className="flex flex-row mb-5 mt-5">
          <View className="px-5">
            <ButtonBack
              onPressFn={() =>
                navigation.navigate("TabNavigatorProducer", { screen: "Sales" })
              }
            />
          </View>
          <View className="flex-grow">
            <TextHeading3 centered>Détail commande</TextHeading3>
          </View>
        </View>

        {isLoading ? (
          <TextBody1 centered>Chargement de la commande...</TextBody1>
        ) : (
          order && (
            <View>
              <OrderStatus orderData={order} />

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

              <View className="mt-5">
                <TextBody1 centered>Détail</TextBody1>
              </View>
              {products}
              <View className="flex-row justify-between items-center mt-5">
                <Custom
                  label={`TOUT\nANNULER`}
                  extraClasses="bg-danger flex-1 mx-1 rounded-lg p-2"
                  textClasses="text-lightbg font-bold text-lg"
                  onPressFn={handleCancelOrder}
                />
                <Custom
                  label={`TOUT\nVALIDER`}
                  extraClasses="bg-primary flex-1 mx-1 rounded-lg p-2"
                  textClasses="text-lightbg font-bold text-lg"
                  onPressFn={() => {}}
                />
              </View>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
