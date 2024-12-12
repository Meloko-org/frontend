import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Spinner() {
  return (
    <View className="flex justify-center items-center">
      <ActivityIndicator size="large" color="#98B66E" />
    </View>
  );
}
