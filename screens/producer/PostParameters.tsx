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

type PostParametersScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostParameters"
>;

type PostParametersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostParameters"
>;

type Props = {
  navigation: PostParametersScreenNavigationProp;
};

export default function PostParametersScreen({ navigation }: Props) {
  const route = useRoute<PostParametersScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour au premium"}
          screen={from || "PremiumOptions"}
          label={screenTitle || "OPTIONS\nPREMIUM"}
          extraClasses="mt-2"
        />

        <View className="px-3">
          <OpenScreenButton
            label="Mes réseaux"
            redAlert={true}
            onPressFn={() => {
              navigation.navigate("PostNetworks", {
                from: "PostParameters",
                backLabel: "Retour aux paramètres",
                screenTitle: "MES\nRESEAUX",
              });
            }}
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Fréquence des posts"
            redAlert={true}
            onPressFn={() => {
              navigation.navigate("PostFrequency", {
                from: "PostParameters",
                backLabel: "Retour aux paramètres",
                screenTitle: "FREQUENCE\nDES POSTS",
              });
            }}
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Hashtags"
            redAlert={true}
            onPressFn={() => {
              navigation.navigate("PostHashtags", {
                from: "PostParameters",
                backLabel: "Retour aux paramètres",
                screenTitle: "HASHTAGS",
              });
            }}
            extraClasses="mb-1"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
