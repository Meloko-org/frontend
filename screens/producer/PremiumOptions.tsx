import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StatusIndicator from "../../components/utils/StatusIndicator";
import { useCanPost } from "../../hooks/useCanPost";

type PremiumOptionsScreenRouteProp = RouteProp<
  RootStackParamList,
  "PremiumOptions"
>;

type PremiumOptionsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PremiumOptions"
>;

type Props = {
  navigation: PremiumOptionsScreenNavigationProp;
};

export default function PremiumOptionsScreen({ navigation }: Props) {
  const route = useRoute<PremiumOptionsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const canPost = useCanPost();

  // console.log(canPost);
  // console.log(JSON.stringify(shopStore?.socials, null, 2));

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour à la boutique"}
          screen={from || "ShopProducer"}
          label={screenTitle || "OPTIONS\nPREMIUM"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 10 }}>
        <OpenScreenButton
          label="Créer un post"
          bgColor={canPost ? "bg-premium" : "bg-premium/50"}
          disabled={!canPost}
          onPressFn={() => {
            navigation.navigate("PostType", {
              from: "PremiumOptions",
              backLabel: "Retour au premium",
              screenTitle: "TYPE\nDE POST",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Posts programmés"
          bgColor={canPost ? "bg-premium" : "bg-premium/50"}
          notice="2"
          disabled={!canPost}
          onPressFn={() => {
            navigation.navigate("ProgrammedPosts", {
              from: "PremiumOptions",
              backLabel: "Retour au premium",
              screenTitle: "POSTS\nPROGRAMMES",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Paramètres"
          bgColor="bg-premium"
          redAlert={!canPost}
          onPressFn={() => {
            navigation.navigate("PostParameters", {
              from: "PremiumOptions",
              backLabel: "Retour au premium",
              screenTitle: "PARAMETRES",
            });
          }}
          extraClasses="mb-1"
        />
      </View>

      <View className="px-3" style={{ flex: 2 }}>
        <StatusIndicator
          status={canPost ? "success" : "error"}
          message={
            canPost
              ? "Tout est prêt. Vous pouvez créer des posts."
              : "Vérifier les paramètres."
          }
          icon="check-circle"
        />
      </View>
    </SafeAreaView>
  );
}
