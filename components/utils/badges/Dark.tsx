import React, { JSX, ReactElement } from "react";
import { Text, View } from "react-native";

type Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  textClasses?: string;
};

export default function PricePer({
  children,
  extraClasses,
  textClasses = "text-xs",
}: Props): JSX.Element {
  return (
    <View
      className={`${extraClasses} rounded-lg bg-darkbg dark:bg-lightbg py-1 px-2`}
    >
      <Text
        className={`text-lightbg dark:text-darkbg text-center ${textClasses}`}
      >
        {children}
      </Text>
    </View>
  );
}
