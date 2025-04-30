import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { RouteProp, useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { OrdersState } from "../../reducers/orders";
import { OrderData } from "../../types/API";
import OrderStatus from "../../components/cards/OrderStatus";

type ValidatedOrdersScreenRouteProp = RouteProp<
  RootStackParamList,
  "ValidatedOrders"
>;

type ValidatedOrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ValidatedOrders"
>;

type Props = {
  navigation: ValidatedOrdersScreenNavigationProp;
};

export default function ValidatedOrdersScreen({ navigation }: Props) {
  const route = useRoute<ValidatedOrdersScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const ordersStore = useSelector(
    (state: { orders: OrdersState }) => state.orders.value,
  );

  const [validateOrders, setValidateOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (!ordersStore) return;

    setValidateOrders(
      ordersStore.filter((order) => order.details[0].status === "validated"),
    );
  }, []);

  const validateOrderCards = validateOrders.map((order) => {
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
        label={screenTitle || "COMMANDES\nVALIDEES"}
        extraClasses="mt-2"
      />

      <ScrollView>
        <View className="px-3">{validateOrderCards}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
