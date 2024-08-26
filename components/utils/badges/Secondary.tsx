import React from "react";
import { Text, View } from "react-native";

type BadgeSecondaryProps = {
  children: string;
  uppercase?: boolean;
  extraClasses?: string;
};

export default function BadgeSecondary(
  props: BadgeSecondaryProps,
): JSX.Element {
  return (
    <View
      className={`${props.extraClasses} rounded-lg border w-fit bg-lightbg border-primary p-1 dark:bg-tertiary `}
    >
      <Text
        className={`${props.uppercase && "uppercase"} text-[11px] text-darkbg dark:text-lightbg text-center w-fit`}
      >
        {props.children}
      </Text>
    </View>
  );
}
