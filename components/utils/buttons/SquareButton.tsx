import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { StatusData } from "../../../types/API";

type Props = {
  color: string;
  size: number; // ex: 40
  isActive: boolean;
  status: StatusData;
  onPressFn: (status: StatusData) => void;
};

export default function SquareButton({
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
        <Animated.View className={`${color} rounded-lg w-full h-full`} />
      </Animated.View>
    </Pressable>
  );
}
