import React from "react";
import { Text, View } from "react-native";

type BadgeGreyProps = {
  children: string;
  extraClasses?: string;
};

export default function BadgeGrey(props: BadgeGreyProps): JSX.Element {
  return (
    <View
      className={`${props.extraClasses} rounded-lg bg-gray-300 dark:bg-tertiary dark:border dark:border-primary py-1 px-4`}
    >
      <Text className="text-darkbg text-sm font-bold dark:text-lightbg text-center">
        {props.children}
      </Text>
    </View>
  );
}
