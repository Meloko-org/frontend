import React, { JSX } from "react";
import { Text, View } from "react-native";

type TagBadgeProps = {
  extraClasses?: string;
  textClasses?: string;
  children: string;
};

export default function TagBadge({
  extraClasses,
  textClasses,
  children,
}: TagBadgeProps): JSX.Element {
  return (
    <View className={`${extraClasses} rounded-lg bg-primary`}>
      <Text className={`${textClasses} text-lightbg text-center`}>
        {children}
      </Text>
    </View>
  );
}
