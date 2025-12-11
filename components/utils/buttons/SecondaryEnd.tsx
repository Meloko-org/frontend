import React, { JSX, useRef } from "react";
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";

import { iconLibraries, IconLibraryName } from "../../iconLibraries";

import { GestureResponderEvent } from "react-native";

type ButtonSecondaryEndProps = {
  label: string;
  iconFamily?: IconLibraryName;
  iconName: string;
  extraClasses?: string;
  disabled?: boolean;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  isLoading?: boolean;
};

export default function ButtonSecondaryEnd({
  label,
  iconFamily,
  iconName,
  extraClasses,
  disabled,
  onPressFn,
  isLoading,
}: ButtonSecondaryEndProps): JSX.Element {
  // const { colorScheme } = useColorScheme();

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
					${disabled ? "bg-lightbg/60" : "bg-lightbg/90 dark:bg-transparent"}
					 border border-primary relative flex flex-row rounded-lg shadow-sm py-1 justify-center items-center px-2 w-min
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
            <View className="flex-grow">
              <Text className="text-darkbg dark:text-lightbg text-center font-bold text-[24px]">
                {label}
              </Text>
            </View>
            <View>
              {IconComponent && (
                <IconComponent
                  name={iconName}
                  size={25}
                  color="#FFFFFF"
                  // className="absolute"
                  // style={{ right: 20 }}
                />
              )}
            </View>
          </View>
          {/* <Text className="text-darkbg text-center m-2 font-bold text-[24px] dark:text-lightbg">
            {label}
          </Text>
          <FontAwesome
            name={iconName}
            size={25}
            color={colorScheme === "dark" ? "#FCFFF0" : "#262E20"}
            className="absolute"
            style={{ right: 20 }}
          /> */}
        </>
      )}
    </TouchableOpacity>
  );
}
