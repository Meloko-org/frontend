import React, { JSX } from "react";
import { Text } from "react-native";

type TextBody1Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  centered?: boolean;
};

export default function TextBody1(props: TextBody1Props): JSX.Element {
  return (
    <>
      <Text
        className={`
          ${props.extraClasses} 
          ${props.centered ? "text-center" : "text-left"} 
          text-secondary dark:text-lightbg`}
      >
        {props.children}
      </Text>
    </>
  );
}
