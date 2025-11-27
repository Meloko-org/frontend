import React, { JSX } from "react";
import { iconLibraries, IconLibraryName } from "../iconLibraries";

import { View } from "react-native";

type NetworkIconProps = {
  iconName: string;
  iconFamily: IconLibraryName;
  color?: string;
  size?: number;
  extraClasses?: string;
};

export default function NetworkIcon({
  iconName,
  iconFamily,
  color,
  size = 25,
  extraClasses,
}: NetworkIconProps) {
  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  return (
    <View className={`${extraClasses}`}>
      <IconComponent name={iconName} color={color} size={size} />
    </View>
  );
}
