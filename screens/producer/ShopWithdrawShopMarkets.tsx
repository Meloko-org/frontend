import React from "react";
import { useState, useEffect } from "react";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawShopMarkets"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawShopMarkets"
>;

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawShopMarketsScreen({
  navigation,
  route,
}: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour modes de retrait"}
          screen={
            from || onboarding
              ? "OnboardingShopWithdrawModes"
              : "ShopWithdrawModes"
          }
          label={screenTitle || "POINTS DE\nVENTE"}
          navigationOverride={navigation}
          screenParams={{ onboarding }}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 mt-5" style={{ flex: 11 }}>
        <ScrollView>
          <View className="px-3">
            <OpenScreenButton
              label="Rechercher des points de vente"
              onPressFn={() => {
                if (onboarding) {
                  (navigation as FromRootStack["navigation"]).navigate(
                    "OnboardingShopWithdrawShopMarketsSearch",
                    {
                      from: "OnboardingShopWithdrawModes",
                      backLabel: "Retour modes de retrait",
                      screenTitle: "CLICK &\nCOLLECT",
                      onboarding: true,
                    },
                  );
                } else {
                  (navigation as FromProducerTab["navigation"]).navigate(
                    "ShopWithdrawShopMarketsSearch",
                    {
                      from: "ShopWithdrawModes",
                      backLabel: "Retour modes de retrait",
                      screenTitle: "CLICK &\nCOLLECT",
                    },
                  );
                }
              }}
              extraClasses="mb-2"
            />
            <OpenScreenButton
              label="Gérer les points de vente"
              onPressFn={() => {
                if (onboarding) {
                  (navigation as FromRootStack["navigation"]).navigate(
                    "OnboardingShopWithdrawShopMarketsManage",
                    {
                      from: "OnboardingShopWithdrawModes",
                      backLabel: "Retour modes de retrait",
                      screenTitle: "CLICK &\nCOLLECT",
                      onboarding: true,
                    },
                  );
                } else {
                  (navigation as FromProducerTab["navigation"]).navigate(
                    "ShopWithdrawShopMarketsManage",
                    {
                      from: "ShopWithdrawModes",
                      backLabel: "Retour modes de retrait",
                      screenTitle: "CLICK &\nCOLLECT",
                    },
                  );
                }
              }}
              extraClasses="mb-2"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
