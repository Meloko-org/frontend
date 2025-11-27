import React, { JSX } from "react";
import { useState, useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { GestureResponderEvent } from "react-native";
import { iconLibraries, IconLibraryName } from "../../iconLibraries";

type NetworkSelectableButtonProps = {
  iconName: string;
  iconFamily?: IconLibraryName;
  extraClasses?: string;
  selected: boolean;
  onPressFn: (event: GestureResponderEvent) => void;
  size?: number;
};

export default function NetworkSelectableButton({
  iconName,
  iconFamily,
  extraClasses,
  selected,
  onPressFn,
  size,
}: NetworkSelectableButtonProps): JSX.Element {
  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  return (
    <TouchableOpacity
      className={`
				${extraClasses} 
				flex flex-row border border-primary rounded-lg justify-center items-center
				${selected ? "bg-primary" : "bg-tertiary"}
			`}
      onPress={onPressFn}
    >
      {IconComponent && (
        <IconComponent
          name={iconName}
          size={size ? size : 25}
          color={"white"}
        />
      )}
    </TouchableOpacity>
  );
}
