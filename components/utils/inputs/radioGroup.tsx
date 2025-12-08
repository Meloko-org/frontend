import React, { useState, useEffect, JSX } from "react";
import { TouchableOpacity, Text, View } from "react-native";

// le type est exporté et non placé dans API.tsx car il est spécifique à ce composant
export type InputRadioGroupData<T extends string = string> = {
  label: string;
  value: T;
  selected: boolean;
  iconName?: string;
};

type InputRadioGroupProps = {
  data: InputRadioGroupData[];
  extraClasses?: string;
  size: "base" | "large";
  onPressFn: ((value: string) => void) | undefined;
};

export default function InputButtonGroup({
  data,
  extraClasses,
  onPressFn,
  size,
}: InputRadioGroupProps): JSX.Element {
  const handleRadioSelection = (value: string) => {
    onPressFn?.(value);
  };

  const buttons = data.map((b, i) => (
    <TouchableOpacity
      key={b.value}
      className={`
        ${b.selected ? "bg-primary" : "bg-lightbg dark:bg-tertiary"} 
        ${i === 0 && "rounded-l-lg"}
        ${i === data.length - 1 && "rounded-r-lg"}
        flex flex-row p-2 justify-center items-center border border-primary
      `}
      onPress={() => handleRadioSelection(b.value)}
    >
      <Text
        className={`
          ${b.selected ? "font-bold text-white" : "text-black dark:text-lightbg"}
          ${size === "large" ? "text-lg" : "text-base"}
        `}
      >
        {b.label}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <View
      className={`${extraClasses} flex flex-row justify-center items-center w-full shadow-sm`}
    >
      {buttons}
    </View>
  );
}
