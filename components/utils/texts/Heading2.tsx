import React, { JSX } from "react";
import { Text } from "react-native";

type TextHeading2Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  centered?: boolean;
};

export default function TextHeading2(props: TextHeading2Props): JSX.Element {
  return (
    <>
      <Text
        className={`${props.extraClasses} ${props.centered && "text-center"} font-bold text-secondary text-[34px] dark:text-lightbg`}
      >
        {props.children}
      </Text>
    </>
  );
}
