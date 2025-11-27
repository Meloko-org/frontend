import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { StatusData } from "../../../types/API";

import { iconLibraries, IconLibraryName } from "../../iconLibraries";

type Props = {
  iconName: string;
  iconFamily?: IconLibraryName;
  iconColor?: string;
  iconSize: number;
  color: string;
  size: number; // ex: 40
  isActive: boolean;
  status: StatusData;
  onPressFn: (status: StatusData) => void;
};

export default function SquareButton({
  iconName,
  iconFamily,
  iconColor,
  iconSize,
  color,
  size,
  isActive,
  onPressFn,
  status,
}: Props) {
  const scale = useRef(new Animated.Value(isActive ? 1.5 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.5 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  }, [isActive, scale]);

  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  return (
    <Pressable onPress={() => onPressFn(status)}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          transform: [{ scale }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          className={`${color} rounded-lg w-full h-full flex items-center justify-center`}
        >
          {IconComponent && (
            <IconComponent
              name={iconName}
              size={iconSize ? iconSize : 25}
              color={iconColor}
            />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
