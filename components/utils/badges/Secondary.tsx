import React, { JSX } from "react";
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
      className={`
        ${props.extraClasses} 
        flex justify-center 
        px-2
        rounded-lg 
        border border-primary 
        bg-lightbg dark:bg-tertiary
      `}
    >
      <Text
        className={`${props.uppercase && "uppercase"} ${props.textClasses} text-darkbg dark:text-lightbg text-center`}
      >
        {props.children}
      </Text>
    </View>
  );
}
