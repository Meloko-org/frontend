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

type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePost">;

type CreatePostScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

type Props = {
  navigation: CreatePostScreenNavigationProp;
};

export default function CreatePostScreen({ navigation }: Props) {
  const route = useRoute<CreatePostScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour au choix"}
          screen={from || "CreatePost"}
          label={screenTitle || "CREER\nUN POST"}
          extraClasses="mt-2"
        />

        <View className="px-3"></View>
      </SafeAreaView>
    </View>
  );
}
