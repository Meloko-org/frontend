import React, { useCallback } from "react";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { NoteData } from "../../types/API";

type ActivityPostChoiceScreenRouteProp = RouteProp<
  RootStackParamList,
  "ActivityPostChoice"
>;

type ActivityPostChoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ActivityPostChoice"
>;

type Props = {
  navigation: ActivityPostChoiceScreenNavigationProp;
};

export default function ActivityPostChoiceScreen({ navigation }: Props) {
  const route = useRoute<ActivityPostChoiceScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [notices, setNotices] = useState<NoteData[]>([]);

  useFocusEffect(useCallback(() => {}, [shopStore]));

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au type"}
          screen={from || "PostType"}
          label={screenTitle || "CREER\nUN POST"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3" style={{ flex: 9 }}></View>
    </SafeAreaView>
  );
}
