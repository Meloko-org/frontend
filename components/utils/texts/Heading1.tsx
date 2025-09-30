import React, { JSX } from "react";
import { Text } from "react-native";

type TextHeading1Props = {
  children: React.ReactNode | string | number;
  extraClasses?: string;
  centered?: boolean;
  textClasses?: string;
};

export default function TextHeading1({
  children,
  extraClasses,
  centered,
  textClasses,
}: TextHeading1Props): JSX.Element {
  return (
    <>
      <Text
        className={`
          ${extraClasses} 
          ${textClasses ? textClasses : "text-secondary dark:text-lightbg"}
          font-bold text-[48px] w-full text-center
        `}
      >
        {children}
      </Text>
    </>
  );
}
