import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";

type ShopWithdrawDeliveryScreenRouteProp = RouteProp<
  RootStackParamList,
  "ShopWithdrawDelivery"
>;

type ShopWithdrawDeliveryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopWithdrawDelivery"
>;

type Props = {
  navigation: ShopWithdrawDeliveryScreenNavigationProp;
};

export default function ShopWithdrawDeliveryScreen({ navigation }: Props) {
  const route = useRoute<ShopWithdrawDeliveryScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à l'accueil"}
          screen={from || "Home"}
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          extraClasses="mt-2"
        />

        <ScrollView></ScrollView>
      </SafeAreaView>
    </View>
  );
}
