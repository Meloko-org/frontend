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

type PostHashtagsScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostHashtags"
>;

type PostHashtagsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostHashtags"
>;

type Props = {
  navigation: PostHashtagsScreenNavigationProp;
};

export default function PostHashtagsScreen({ navigation }: Props) {
  const route = useRoute<PostHashtagsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour aux paramètres"}
          screen={from || "PostHashtags"}
          label={screenTitle || "PARAMETRES"}
          extraClasses="mt-2"
        />
        <ScrollView>
          <View className="px-3"></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
