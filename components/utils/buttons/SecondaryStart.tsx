import React, { JSX, useRef } from "react";
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";

import { iconLibraries, IconLibraryName } from "../../iconLibraries";

import { GestureResponderEvent } from "react-native";

type ButtonSecondaryStartProps = {
  label: string;
  iconFamily?: IconLibraryName;
  iconName: string;
  extraClasses?: string;
  disabled?: boolean;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  isLoading?: boolean;
};

export default function ButtonSecondaryStart({
  label,
  iconFamily,
  iconName,
  extraClasses,
  disabled,
  onPressFn,
  isLoading,
}: ButtonSecondaryStartProps): JSX.Element {
  const ball1 = useRef(new Animated.Value(0)).current;
  const ball2 = useRef(new Animated.Value(0)).current;
  const ball3 = useRef(new Animated.Value(0)).current;

  Animated.loop(
    Animated.stagger(100, [
      Animated.sequence([
        Animated.timing(ball1, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ball1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(ball2, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ball2, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(ball3, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ball3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]),
  ).start();

  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  return (
    <TouchableOpacity
      className={`
					${extraClasses} 
					${disabled ? "bg-darkbg/20 dark:bg-tertiary" : "bg-lightbg dark:bg-darkbg"}
					relative flex flex-row rounded-lg border border-primary py-1 justify-center items-center px-2 w-min
				`}
      onPress={onPressFn}
      disabled={disabled}
    >
      {isLoading ? (
        <View className="flex flex-row space-x-2 justify-center items-center h-12">
          <Animated.View
            className="h-4 w-4 bg-lightbg rounded-full"
            style={{ transform: [{ translateY: ball1 }] }}
          ></Animated.View>
          <Animated.View
            className="h-4 w-4 bg-lightbg rounded-full"
            style={{ transform: [{ translateY: ball2 }] }}
          ></Animated.View>
          <Animated.View
            className="h-4 w-4 bg-lightbg rounded-full"
            style={{ transform: [{ translateY: ball3 }] }}
          ></Animated.View>
        </View>
      ) : (
        <>
          <View className="flex flex-row items-center">
            <View>
              {IconComponent && (
                <IconComponent
                  name={iconName}
                  size={25}
                  className="text-darkbg dark:text-lightbg"
                />
              )}
            </View>
            <View className="flex-grow">
              <Text className="text-darkbg dark:text-lightbg text-center font-bold text-[24px]">
                {label}
              </Text>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
