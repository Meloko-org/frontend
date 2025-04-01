import React, { useRef } from "react";

import { Text, TouchableOpacity, Animated, View } from "react-native";
import { GestureResponderEvent } from "react-native";

import EntypoIcon from "@expo/vector-icons/Entypo";
import EvilIcon from "@expo/vector-icons/EvilIcons";
import FeatherIcon from "@expo/vector-icons/Feather";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import FontistoIcon from "@expo/vector-icons/Fontisto";
import FoundationIcon from "@expo/vector-icons/Foundation";
import IonIcon from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import OctIcon from "@expo/vector-icons/Octicons";
import SimpleLineIcon from "@expo/vector-icons/SimpleLineIcons";
import ZocialIcon from "@expo/vector-icons/Zocial";

type CustomProps = {
  label: string;
  icon?: string;
  iconFamily?: keyof typeof iconLibraries;
  extraClasses?: string;
  textClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  isLoading?: boolean;
};

const iconLibraries = {
  EntypoIcon,
  EvilIcon,
  FeatherIcon,
  FontAwesomeIcon,
  FontAwesome5Icon,
  FontAwesome6Icon,
  FontistoIcon,
  FoundationIcon,
  IonIcon,
  MaterialCommunityIcon,
  MaterialIcon,
  OctIcon,
  SimpleLineIcon,
  ZocialIcon,
};

export default function CustomButton({
  label,
  icon,
  iconFamily,
  extraClasses,
  textClasses,
  onPressFn,
  isLoading,
}: CustomProps): JSX.Element {
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
    : FontAwesome5Icon;

  return (
    <TouchableOpacity
      className={`
					${extraClasses} 
					 flex justify-center items-center w-min
				`}
      onPress={onPressFn}
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
          <View className="flex flex-row jsutify-center">
            <Text
              className={`
                  ${textClasses}
                  text-center
                  mr-1
                `}
            >
              {label}
            </Text>
            {icon && IconComponent && (
              <IconComponent name={icon} size={25} color="#FFFFFF" />
            )}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
