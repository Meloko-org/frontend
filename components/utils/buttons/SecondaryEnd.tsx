import React, { useRef } from "react";
import { Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import { GestureResponderEvent } from "react-native";
const FontAwesome = _Fontawesome as React.ElementType;
import { useColorScheme } from "nativewind";

type ButtonSecondaryEndProps = {
  label: string;
  iconName: string;
  extraClasses?: string;
  disabled: boolean;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  isLoading: boolean;
};

export default function ButtonSecondaryEnd(
  props: ButtonSecondaryEndProps,
): JSX.Element {
  const { colorScheme } = useColorScheme();

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

  return (
    <TouchableOpacity
      className={`
					${props.extraClasses} 
					${props.disabled ? "bg-lightbg/60" : "bg-lightbg/90 dark:bg-transparent"}
					 border border-primary relative flex flex-row rounded-lg shadow-sm py-1 justify-center items-center px-4 w-min
				`}
      onPress={props.onPressFn}
      disabled={props.disabled}
    >
      {props.isLoading ? (
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
          <Text className="text-darkbg text-center m-2 font-bold text-[24px] dark:text-lightbg">
            {props.label}
          </Text>
          <FontAwesome
            name={props.iconName}
            size={25}
            color={colorScheme === "dark" ? "#FCFFF0" : "#262E20"}
            className="absolute"
            style={{ right: 20 }}
          />
        </>
      )}
    </TouchableOpacity>
  );
}
