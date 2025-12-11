import React, { JSX } from "react";
import { Text, View } from "react-native";

type PriceBadgeProps = {
  colour: string;
  extraClasses?: string;
  value?: string;
  textClasses?: string;
  children: string;
};

export default function PriceBadge({
  colour,
  extraClasses,
  value,
  textClasses,
  children,
}: PriceBadgeProps): JSX.Element {
  return (
    <View className={`${extraClasses} ${colour} rounded-lg`}>
      <Text
        className={`${textClasses} text-lightbg dark:text-lightbg text-center`}
      >
        {children}
      </Text>
    </View>
  );
}
