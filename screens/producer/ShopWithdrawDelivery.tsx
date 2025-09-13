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

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawDelivery"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawDelivery"
>;

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawDeliveryScreen({
  navigation,
  route,
}: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à l'accueil"}
          screen={
            from || onboarding
              ? "OnboardingShopWithdrawModes"
              : "ShopWithdrawModes"
          }
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          navigationOverride={navigation}
          screenParams={{ onboarding }}
          extraClasses="mt-2"
        />

        <ScrollView></ScrollView>
      </SafeAreaView>
    </View>
  );
}
