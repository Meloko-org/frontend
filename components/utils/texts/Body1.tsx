import React, { JSX } from "react";
import { Text } from "react-native";

type TextBody1Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  centered?: boolean;
  textClasses?: string;
};

export default function TextBody1({
  children,
  extraClasses,
  centered,
  textClasses,
}: TextBody1Props): JSX.Element {
  return (
    <>
      <Text
        className={`
          ${extraClasses} 
          ${centered ? "text-center" : "text-left"} 
          ${textClasses ? textClasses : "text-secondary dark:text-lightbg"}
        `}
      >
        {children}
      </Text>
    </>
  );
}
