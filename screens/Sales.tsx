import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { OrderData } from "../types/API";

import { Text, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../components/utils/texts/Heading2";
import producerTools from "../modules/producerTools";
import OrderStatus from "../components/cards/OrderStatus";
import TextBody1 from "../components/utils/texts/Body1";
import Spinner from "../components/utils/Spinner";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigatorProducer"
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SalesScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const response = await producerTools.getAllOrders(token);

      if ("message" in response) {
        Alert.alert("Erreur", response.message);
        console.log(response.message);
      } else {
        setOrders(response);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes.");
    } finally {
      setIsFetchLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  const handlePressCard = (order: OrderData) => {
    navigation.navigate("TabNavigatorProducer", {
      screen: "OrderDetails",
      params: {
        orderId: order._id,
      },
    });
  };

  const orderCards = orders.map((order) => {
    return (
      <OrderStatus
        key={order._id}
        orderData={order}
        extraClasses="mb-3"
        onPressFn={() => {
          console.log("clicked order: ", order._id);
          handlePressCard(order);
        }}
      />
    );
  });

  const nbrOrders = orders ? orders.length.toString() : 0;

  // console.log(JSON.stringify(orders, null, 2));
  // console.log(orderCards);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full px-3 pb-5"
      >
        <TextHeading2 extraClasses="mt-2 mb-5" centered>
          Ventes en cours ({nbrOrders})
        </TextHeading2>

        {isFetchLoading ? <Spinner /> : orderCards}
      </ScrollView>
    </SafeAreaView>
  );
}
