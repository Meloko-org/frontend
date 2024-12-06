import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { Text, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../components/utils/texts/Heading2";
import producerTools from "../modules/producerTools";
import OrderStatus from "../components/cards/OrderStatus";
import { OrderData } from "../types/API";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Sales"
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SalesScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<string[]>([]);
  const [orderCards, setOrderCards] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const response = await producerTools.getAllOrders(token);

      if ("message" in response) {
        Alert.alert("Erreur", response.message);
        console.log(response.message);
      } else {
        setOrders(response);
      }
    })();
  }, []);

  const handlePressCard = (order: OrderData) => {
    navigation.navigate("TabNavigatorProducer", {
      screen: "OrderDetails",
      params: {
        orderId: order._id,
      },
    });
  };

  useEffect(() => {
    const ordersForCard = orders.map((order: OrderData) => {
      return (
        <OrderStatus
          key={order._id}
          orderData={order}
          extraClasses="mb-3"
          onPressFn={() => handlePressCard(order)}
        />
      );
    });
    setOrderCards(ordersForCard);
  }, [orders]);

  const nbrOrders = orders ? orders.length.toString() : 0;

  // console.log(JSON.stringify(orders, null, 2));
  console.log(orderCards);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3 pb-5"
      >
        <TextHeading2 extraClasses="mt-2 mb-5" centered>
          Ventes en cours ({nbrOrders})
        </TextHeading2>

        {orderCards}
      </ScrollView>
    </SafeAreaView>
  );
}
