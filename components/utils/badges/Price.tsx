import React from "react";
import { Text, View } from "react-native";

type PriceBadgeProps = {
  colour: string;
  extraClasses?: string;
  value: string;
};

export default function PriceBadge({
  colour,
  extraClasses,
  value,
}: PriceBadgeProps): JSX.Element {
  return (
    <View className={`${extraClasses} ${colour} rounded-lg w-24`}>
      <Text className="text-lightbg dark:text-darkbg text-center text-xs">
        {value} €
      </Text>
    </View>
  );
}
