import React, { useState } from "react";
import { View, Switch } from "react-native";
import TextHeading4 from "../texts/Heading4";

type SwitchInputProps = {
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor: string;
  ios_backgroundColor?: string;
  label: string;
  value: boolean;
  onValueChange: (isEnabled: boolean) => void; // Fonction appelée lorsque l'utilisateur active/désactive le switch
  extraClasses?: string;
};

export default function SwitchInput(props: SwitchInputProps): JSX.Element {
  const toggleSwitch = () => props.onValueChange(!props.value);

  return (
    <View className={`${props.extraClasses} flex flex-row`}>
      <View
        className={`${props.value ? "bg-primary" : "bg-lightbg"} flex justify-center border border-secondary rounded-full w-[50px] h-[26px]`}
      >
        <Switch
          trackColor={{ false: "#FCFFF0", true: "#98B66E" }}
          thumbColor={props.value ? "#262E20" : "#262E20"}
          ios_backgroundColor={props.value ? "#98B66E" : "#262E20"}
          onValueChange={toggleSwitch} // Gère le changement ici
          value={props.value} // La valeur est gérée par le parent
        />
      </View>
      <TextHeading4 extraClasses="inline pl-3">{props.label}</TextHeading4>
    </View>
  );
}
