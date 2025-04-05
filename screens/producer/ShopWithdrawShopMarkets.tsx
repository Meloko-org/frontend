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
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

type ShopWithdrawShopMarketsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ShopWithdrawShopMarkets"
>;

type ShopWithdrawShopMarketsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopWithdrawShopMarkets"
>;

type Props = {
  navigation: ShopWithdrawShopMarketsScreenNavigationProp;
};

export default function ShopWithdrawShopMarketsScreen({ navigation }: Props) {
  const route = useRoute<ShopWithdrawShopMarketsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour modes de retrait"}
          screen={from || "Shop"}
          label={screenTitle || "POINTS DE\nVENTE"}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="px-3">
            <OpenScreenButton
              label="Rechercher des points de vente"
              onPressFn={() =>
                navigation.navigate("ShopWithdrawShopMarketsSearch", {
                  from: "ShopWithdrawShopMarkets",
                  backLabel: "Retour points de vente",
                  screenTitle: "RECHERCHE\nPOINTS DE VENTE",
                })
              }
              extraClasses="mb-2"
            />
            <OpenScreenButton
              label="Gérer les points de vente"
              onPressFn={() =>
                navigation.navigate("ShopWithdrawShopMarketsManage", {
                  from: "ShopWithdrawShopMarkets",
                  backLabel: "Retour points de vente",
                  screenTitle: "GESTION\nPOINTS DE VENTE",
                })
              }
              extraClasses="mb-2"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
