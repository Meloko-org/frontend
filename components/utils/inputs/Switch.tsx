import React, { JSX, useState } from "react";
import { View, Switch } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody1 from "../texts/Body1";

type SwitchInputProps = {
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: string;
  ios_backgroundColor?: string;
  label: string | React.ReactNode;
  value: boolean;
  onValueChange: (isEnabled: boolean) => void; // Fonction appelée lorsque l'utilisateur active/désactive le switch
  extraClasses?: string;
  disabled?: boolean;
};

export default function SwitchInput({
  trackColor,
  thumbColor,
  ios_backgroundColor,
  label,
  value,
  onValueChange,
  extraClasses,
  disabled = false,
}: SwitchInputProps): JSX.Element {
  const toggleSwitch = () => {
    if (!disabled) onValueChange(!value);
  };

  return (
    <View className={`${extraClasses}`}>
      <View className="flex flex-row items-center">
        <View
          className={`${value ? "bg-primary" : "bg-lightbg"} flex justify-center border border-secondary rounded-full w-[50px] h-[26px]`}
        >
          <Switch
            trackColor={{ false: "#FCFFF0", true: "#98B66E" }}
            thumbColor={value ? "#262E20" : "#262E20"}
            ios_backgroundColor={value ? "#98B66E" : "#262E20"}
            onValueChange={toggleSwitch} // Gère le changement ici
            value={value} // La valeur est gérée par le parent
            disabled={disabled}
          />
        </View>

        {typeof label === "string" ? (
          <TextBody1
            extraClasses={`inline pl-3 font-bold text-[18px] ${disabled ? "opacity-50" : ""}`}
          >
            {label}
          </TextBody1>
        ) : (
          <View
            className={`flex flex-row items-center pl-3 ${disabled ? "opacity-50" : ""}`}
          >
            {label}
          </View>
        )}
      </View>
    </View>
  );
}
