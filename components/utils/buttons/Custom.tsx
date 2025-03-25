import React, { useRef } from "react";

import { Text, TouchableOpacity, Animated, View } from "react-native";
import { GestureResponderEvent } from "react-native";

type CustomProps = {
  label: string;
  extraClasses?: string;
  textClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  isLoading?: boolean;
};

export default function Custom(props: CustomProps): JSX.Element {
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
					 flex justify-center items-center w-min
				`}
      onPress={props.onPressFn}
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
          <Text
            className={`
                ${props.textClasses}
                text-center
              `}
          >
            {props.label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
