import React from "react";
import { Text, View } from "react-native";

type BlackBadgesProps = {
  extraClasses?: string;
  textClasses?: string;
  children: string;
};

export default function BlackBadge({
  extraClasses,
  textClasses,
  children,
}: BlackBadgesProps): JSX.Element {
  return (
    <View className={`${extraClasses} rounded-lg bg-night`}>
      <Text className={`${textClasses} text-lightbg text-center`}>
        {children}
      </Text>
    </View>
  );
}
