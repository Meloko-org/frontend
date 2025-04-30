import React from "react";
import { Text, View } from "react-native";

type BadgeSecondaryProps = {
  children: React.ReactNode | string | number;
  uppercase?: boolean;
  extraClasses?: string;
  textClasses?: string;
};

export default function BadgeSecondary(
  props: BadgeSecondaryProps,
): JSX.Element {
  return (
    <View
      className={`${props.extraClasses} flex justify-center rounded-lg border w-fit bg-lightbg border-primary dark:bg-tertiary `}
    >
      <Text
        className={`${props.uppercase && "uppercase"} ${props.textClasses} text-darkbg dark:text-lightbg text-center w-fit`}
      >
        {props.children}
      </Text>
    </View>
  );
}
