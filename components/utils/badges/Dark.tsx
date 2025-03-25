import React from "react";
import { Text, View } from "react-native";

export default function PricePer(props): JSX.Element {
  return (
    <View className="rounded-lg bg-darkbg dark:bg-lightbg py-1 px-2">
      <Text className="text-lightbg text-xs dark:text-darkbg text-center">
        {props.children}
      </Text>
    </View>
  );
}
