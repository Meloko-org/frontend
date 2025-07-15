import React, { JSX } from "react";
import { Text } from "react-native";

type TextBody2Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  centered?: boolean;
};

export default function TextBody2(props: TextBody2Props): JSX.Element {
  return (
    <>
      <Text
        className={`${props.extraClasses} ${props.centered ? "text-center" : "text-left"} text-xs dark:text-lightbg`}
      >
        {props.children}
      </Text>
    </>
  );
}
