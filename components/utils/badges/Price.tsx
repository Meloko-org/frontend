import React from "react";
import { Text, View } from "react-native";

export default function Price(): JSX.Element {
  return (
    <View className="rounded-lg w-24 px-2 bg-darkbg dark:bg-lightbg">
      <Text className="text-lightbg dark:text-darkbg text-center text-xs">
        3.80 €
      </Text>
    </View>
  );
}
