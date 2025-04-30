import React, { ReactElement } from "react";
import { Text, View } from "react-native";

type Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
};

export default function PricePer({
  children,
  extraClasses,
}: Props): JSX.Element {
  return (
    <View
      className={`${extraClasses} rounded-lg bg-darkbg dark:bg-lightbg py-1 px-2`}
    >
      <Text className="text-lightbg text-xs dark:text-darkbg text-center">
        {children}
      </Text>
    </View>
  );
}
