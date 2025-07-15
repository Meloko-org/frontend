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
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { useCanPost } from "../../hooks/useCanPost";

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

  const canPost = useCanPost();

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au premium"}
          screen={from || "PremiumOptions"}
          label={screenTitle || "PARAMETRES"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View className="px-3" style={{ flex: 9 }}>
        <OpenScreenButton
          label="Mes réseaux"
          redAlert={!canPost}
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
          // redAlert={true}
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
          // redAlert={true}
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
  );
}
