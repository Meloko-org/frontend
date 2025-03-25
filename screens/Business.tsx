import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import producerTools from "../modules/producerTools";

import { Text, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../components/utils/texts/Heading2";
import OrderStatus from "../components/cards/OrderStatus";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextBody2 from "../components/utils/texts/Body2";
import TextBody1 from "../components/utils/texts/Body1";

import _Fontawesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { OrderData } from "../types/API";
const FontAwesome = _Fontawesome as React.ElementType;

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigatorProducer"
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function BusinessScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<string[]>([]);
  const [nbrOrders, setNbrOrders] = useState<string | undefined>();

  const fetchOrders = async () => {
    const token = await getToken();

    const responseAll = await producerTools.getAllOrders(token);

    if ("message" in responseAll) {
      Alert.alert("Erreur", responseAll.message);
    } else {
      setNbrOrders(responseAll.length);
    }

    const response = await producerTools.getLastThreeOrders(token);

    if ("message" in response) {
      Alert.alert("Erreur", response.message);
      console.log(response.message);
    } else {
      setOrders(response);
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

  const ordersCards = orders.map((order) => {
    return (
      <OrderStatus
        key={order._id}
        orderData={order}
        extraClasses="mb-3"
        onPressFn={() => handlePressCard(order)}
      />
    );
  });

  const handleOrdersPress = () => {
    navigation.navigate("TabNavigatorProducer", {
      screen: "Sales",
    });
  };

  // console.log(JSON.stringify(orders, null, 2));

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg px-3">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full h-full"
      >
        <TextHeading2 extraClasses="my-1">Ventes en cours</TextHeading2>

        {ordersCards}

        <ButtonPrimaryEnd
          label={`Toutes les commandes (${nbrOrders})`}
          iconName="shopping-bag"
          disabled={false}
          onPressFn={handleOrdersPress}
          extraClasses="mb-6"
          isLoading={false}
        />

        <View className="flex flex-row items-center">
          <View className="w-[50%]">
            <TextHeading2 extraClasses="my-1">Finances</TextHeading2>
          </View>
          <View className="w-[50%]">
            <View className="flex justify-center rounded-lg p-1 bg-gray-400 h-[40px]">
              <TextBody2 centered>7 derniers jours</TextBody2>
            </View>
          </View>
        </View>

        <View className="flex flex-row items-center px-4">
          <View className="w-[50%]">
            <TextBody1 extraClasses="my-1">Chiffre d'affaire HT</TextBody1>
          </View>
          <View className="w-[50%]">
            <View className="flex items-end">
              <TextBody2>000 €</TextBody2>
            </View>
          </View>
        </View>

        <View className="flex flex-row items-center px-4">
          <View className="w-[50%]">
            <TextBody1 extraClasses="my-1">Commission Meloko</TextBody1>
          </View>
          <View className="w-[50%]">
            <View className="flex items-end">
              <TextBody2>000 €</TextBody2>
            </View>
          </View>
        </View>

        <View className="flex flex-row items-center px-4">
          <View className="w-[50%]">
            <TextBody1 extraClasses="my-1">TVA sur ventes</TextBody1>
          </View>
          <View className="w-[50%]">
            <View className="flex items-end">
              <TextBody2>000 €</TextBody2>
            </View>
          </View>
        </View>

        <View className="flex flex-row items-center justify-center mb-3">
          <View>
            <FontAwesome
              name="clock-o"
              size={30}
              color="#FF0000"
              className="relative"
            />
          </View>
          <View className="pl-3">
            <TextBody1>Prochain virement le 01/10/2025</TextBody1>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
