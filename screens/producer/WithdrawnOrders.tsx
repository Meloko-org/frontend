import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { RouteProp, useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import TopBar from "../../components/TopBar";
import OrderStatus from "../../components/cards/OrderStatus";
import { useSelector } from "react-redux";
import { OrdersState } from "../../reducers/orders";
import { OrderData } from "../../types/API";

type WithdrawnOrdersScreenRouteProp = RouteProp<
  RootStackParamList,
  "WithdrawnOrders"
>;

type WithdrawnOrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "WithdrawnOrders"
>;

type Props = {
  navigation: WithdrawnOrdersScreenNavigationProp;
};

export default function WithdrawnOrdersScreen({ navigation }: Props) {
  const route = useRoute<WithdrawnOrdersScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const ordersStore = useSelector(
    (state: { orders: OrdersState }) => state.orders.value,
  );

  const [withdrawnOrders, setWithdrawnOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (!ordersStore) return;

    setWithdrawnOrders(
      ordersStore.filter((order) => order.details[0].status === "withdrawn"),
    );
  }, []);

  const withdrawnOrderCards = withdrawnOrders.map((order) => {
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
        label={screenTitle || "COMMANDES\nRETIREES"}
        extraClasses="mt-2"
      />

      <ScrollView>
        <View className="px-3">{withdrawnOrderCards}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
