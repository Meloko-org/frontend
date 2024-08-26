import React from "react";
import { Text, View } from "react-native";

export default function BadgeGrey(props): JSX.Element {
  return (
    <View className="rounded-lg w-auto bg-gray-300 dark:bg-tertiary dark:border dark:border-primary py-1 px-4">
      <Text className="text-darkbg text-sm font-bold dark:text-lightbg text-center">
        {props.children}
      </Text>
    </View>
  );
}
