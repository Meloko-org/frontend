import React from "react";
import { Text } from "react-native";

type TextHeading4Props = {
  children: string;
  extraClasses?: string;
  centered?: boolean;
};

export default function TextHeading4(props: TextHeading4Props): JSX.Element {
  return (
    <>
      <Text
        className={`${props.extraClasses} ${props.centered && "text-center"} font-bold text-secondary text-[20px] w-full dark:text-lightbg`}
      >
        {props.children}
      </Text>
    </>
  );
}
