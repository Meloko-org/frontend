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

type ProgrammedPostsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProgrammedPosts"
>;

type ProgrammedPostsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProgrammedPosts"
>;

type Props = {
  navigation: ProgrammedPostsScreenNavigationProp;
};

export default function ProgrammedPostsScreen({ navigation }: Props) {
  const route = useRoute<ProgrammedPostsScreenRouteProp>();
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

        <View className="px-3"></View>
      </SafeAreaView>
    </View>
  );
}
