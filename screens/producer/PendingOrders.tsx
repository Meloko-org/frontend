import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { RouteProp, useRoute } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { OrdersState } from "../../reducers/orders";

import { OrderData } from "../../types/API";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import TopBar from "../../components/TopBar";
import OrderStatus from "../../components/cards/OrderStatus";

type PendingOrdersScreenRouteProp = RouteProp<
  RootStackParamList,
  "PendingOrders"
>;

type PendingOrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PendingOrders"
>;

type Props = {
  navigation: PendingOrdersScreenNavigationProp;
};

export default function PendingOrdersScreen({ navigation }: Props) {
  const route = useRoute<PendingOrdersScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const ordersStore = useSelector(
    (state: { orders: OrdersState }) => state.orders.value,
  );

  const [pendingOrders, setPendingOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (!ordersStore) return;

    setPendingOrders(
      ordersStore.filter((order) => order.details[0].status === "pending"),
    );
  }, []);

  const pendingOrderCards = pendingOrders.map((order) => {
    return (
      <OrderStatus
        key={order?._id}
        orderData={order}
        extraClasses="mb-2"
        onPressFn={() => {
          console.log("clicked order: ", order?._id);
          handlePressCard(order);
        }}
      />
    );
  });

  const handlePressCard = (order) => {};

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au tableau"}
        screen={from || "businessCenter"}
        label={screenTitle || "COMMANDES\nEN ATTENTE"}
        extraClasses="mt-2"
      />

      <ScrollView>
        <View className="px-3">{pendingOrderCards}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
