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

type PostTypeScreenRouteProp = RouteProp<RootStackParamList, "PostType">;

type PostTypeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostType"
>;

type Props = {
  navigation: PostTypeScreenNavigationProp;
};

export default function PostTypeScreen({ navigation }: Props) {
  const route = useRoute<PostTypeScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au premium"}
        screen={from || "PremiumOptions"}
        label={screenTitle || "CRÉER un\nPOST"}
        extraClasses="mt-2"
      />

      <View className="px-3 pt-5">
        <OpenScreenButton
          label="Produit"
          onPressFn={() => {
            navigation.navigate("ProductPostChoice", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "CHOISIR\nUN PRODUIT",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Avis"
          onPressFn={() => {
            navigation.navigate("NoticePostChoice", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "CHOISIR\nUN AVIS",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Activité"
          onPressFn={() => {
            navigation.navigate("ActivityPost", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "POSTER UNE\nACTIVITE",
            });
          }}
          extraClasses="mb-1"
        />
      </View>
    </SafeAreaView>
  );
}
