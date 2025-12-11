import React, { JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "@clerk/clerk-expo";

// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../types/Navigation";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextBody1 from "../../components/utils/texts/Body1";
import CardProducer from "../../components/cards/ProducerSearchResult";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CardProduct from "../../components/cards/Product";
import { UserState } from "../../reducers/user";
import { OrderData } from "../../types/API";
import shopTools from "../../modules/shopTools";
import orderTools from "../../modules/orderTools";
import Spinner from "../../components/utils/Spinner";
import { SheetManager } from "react-native-actions-sheet";

type OrderCustomerRouteProp = RouteProp<UserTabParamList, "OrderCustomer">;

type OrderCustomerNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "OrderCustomer"
>;

type Props = {
  navigation: OrderCustomerNavProp;
  route: OrderCustomerRouteProp;
};

export default function OrderCustomerScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const { orderId } = route.params;

  const { getToken } = useAuth();

  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const [newOrder, setNewOrder] = useState<OrderData | null>(null);

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  /* version 1 basée sur le userStore */
  // useEffect(() => {
  //   const newOrder = userStore.orders.find((o) => o._id === orderId);
  //   setNewOrder(newOrder);
  // }, [route.params, userStore.orders]);

  /* version 2 basée sur le backend */
  useEffect(() => {
    fetchOrder();
  }, [route.params]);

  const fetchOrder = async () => {
    const token = await getToken();
    const orderResponse = await orderTools.getUserOrderById(token, orderId);

    if (!orderResponse.success && orderResponse.message) {
      SheetManager.show("alert", {
        payload: {
          message: orderResponse.message,
          alertType: "error",
        },
      });
      return;
    }

    setNewOrder(orderResponse.data);
  };

  let clickCollectOrdersDisplay: React.ReactNode = null;
  let marketOrdersDisplay: React.ReactNode = null;

  if (newOrder) {
    const clickCollectOrders = newOrder.details.filter(
      (d) => d.withdrawMode === "clickCollect",
    );
    const marketOrders = newOrder.details.filter(
      (d) => d.withdrawMode === "market",
    );

    clickCollectOrdersDisplay = clickCollectOrders.map((cco) => {
      const productList = cco.products.map((p) => {
        return (
          <CardProduct
            stockData={p.product}
            shopData={shopTools.getLightShop(cco.shop)}
            quantity={p.quantity}
            key={p.product._id}
            extraClasses="mb-1"
            displayMode="detail"
            showImage={true}
          />
        );
      });

      return (
        <View key={cco._id} className="mb-5 flex items-center">
          <CardProducer
            shopData={cco.shop}
            withdrawData={cco.products}
            key={cco.shop?._id}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              navigation.navigate("ShopUser", {
                shopId: cco.shop!._id,
                distance: undefined,
                relevantProducts: [],
                sheetId: undefined,
              });
            }}
          />
          {productList}
          <View className="flex flex-row items-center rounded-lg py-1 px-4 bg-white dark:bg-tertiary w-full mb-2">
            <View>
              <TextBody1>Retrait:</TextBody1>
            </View>
            <View className="pl-3">
              <TextHeading4>ClickAndCollect</TextHeading4>
            </View>
          </View>
          <View className="flex flex-row justify-around rounded-lg p-1 bg-succes dark:bg-success  w-full">
            <View className="px-2">
              <TextBody1>Montant:</TextBody1>
            </View>
            <View>
              <TextHeading4>
                {orderTools.getPriceInEuros(cco.shopTotalTTC).toFixed(2)} €
              </TextHeading4>
            </View>
          </View>
        </View>
      );
    });

    marketOrdersDisplay = marketOrders.map((mo) => {
      console.log("marketOrder: ", JSON.stringify(mo, null, 2));
      const productList = mo.products.map((p) => {
        return (
          <CardProduct
            stockData={p.product}
            shopData={shopTools.getLightShop(mo.shop)}
            key={p.product._id}
            extraClasses="mb-1"
            displayMode="detail"
            showImage={true}
          />
        );
      });
      return (
        <View key={mo._id} className="my-2">
          <CardProducer
            shopData={mo.shop}
            withdrawData={mo.products}
            key={mo.shop?._id}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              navigation.navigate("ShopUser", {
                shopId: mo.shop!._id,
                distance: undefined,
                relevantProducts: [],
                sheetId: undefined,
              });
            }}
          />
          {productList}
          <View className="flex flex-row mb-2 rounded-lg p-1 bg-white dark:bg-tertiary  w-full">
            <View className="px-4">
              <TextBody1>Retrait:</TextBody1>
            </View>
            <View>
              <View>
                <TextHeading4>{mo.withdrawMarket}</TextHeading4>
              </View>
              <View>
                <TextHeading4> {weekDays[mo.withdrawDay - 1]}</TextHeading4>
              </View>
            </View>
          </View>
          <View className="flex flex-row justify-around rounded-lg p-1 bg-succes dark:bg-success w-full">
            <View className="px-2">
              <TextBody1>Montant:</TextBody1>
            </View>
            <View>
              <TextHeading4>
                {orderTools.getPriceInEuros(mo.shopTotalTTC).toFixed(2)} €
              </TextHeading4>
            </View>
          </View>
        </View>
      );
    });
  }

  if (!newOrder) {
    return (
      <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
        <View className="flex w-full h-hull">
          <Spinner />
        </View>
      </SafeAreaView>
    );
  }

  console.log("------- ORDER ----------");

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3 flex-1">
        <TextHeading2 extraClasses="mb-3" centered>
          Commande payée
        </TextHeading2>
        <TextBody1 centered extraClasses="mb-2">
          Votre commande est maintenant payée. Vous recevrez un e-mail
          lorsqu'elle sera confirmée.
        </TextBody1>
        <TextHeading4
          centered
          extraClasses="mb-4"
        >{`Commande n° ${newOrder?.invoiceNumber}`}</TextHeading4>
        <View className="rounded-lg bg-danger p-3 mb-3">
          <Text className="font-bold text-white text-center text-[20px]">{`Montant total: ${orderTools.getPriceInEuros(newOrder!.totalTTC).toFixed(2)} €`}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full flex"
        >
          <View className="p-3 mb-5">
            {clickCollectOrdersDisplay}
            {marketOrdersDisplay}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
