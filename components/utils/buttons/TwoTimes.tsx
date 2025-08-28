import React, { JSX, useEffect } from "react";
import { useState, useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  View,
  GestureResponderEvent,
  Pressable,
} from "react-native";

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

type MainButtonProps = {
  buttonType: "top" | "bottom" | "start" | "end" | "iconOnly" | "textOnly";
  label?: string;
  bgColor: string;
  iconName?: string;
  iconFamily?: keyof typeof iconLibraries;
  iconColor?: string;
  extraClasses?: string;
  textClasses?: string;
  onConfirm: () => void;
  confirmColor?: string;
  cancelColor?: string;
  iconSize?: number;
  buttonBackground?: boolean;
  disabled?: boolean;
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

export default function MainButton({
  buttonType,
  label,
  bgColor,
  iconName,
  iconFamily,
  iconColor,
  iconSize,
  onConfirm,
  confirmColor = "bg-primary",
  cancelColor = "bg-tertiary",
  extraClasses,
  textClasses,
  disabled,
  isLoading = false,
}: MainButtonProps): JSX.Element {
  const [confirmMode, setConfirmMode] = useState<boolean>(false);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);

  const confirmAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (confirmMode) {
      Animated.spring(confirmAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 60,
      }).start();
    } else {
      Animated.timing(confirmAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [confirmMode]);

  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : FontAwesome5Icon;

  const icon = (
    <IconComponent name={iconName} size={iconSize} color={iconColor} />
  );

  const text = <Text className={`${textClasses} text-center`}>{label}</Text>;

  const iconTop = (
    <>
      <View className="flex-col items-center justify-center space-y-1">
        {icon}
        {text}
      </View>
    </>
  );

  const iconBottom = (
    <>
      <View className="flex-col items-center justify-center space-y-1">
        {text}
        {icon}
      </View>
    </>
  );

  const iconStart = (
    <>
      <View className="flex-row items-center justify-center space-x-2">
        {icon}
        {text}
      </View>
    </>
  );

  const iconEnd = (
    <>
      <View className="flex-row items-center justify-center space-x-2">
        {text}
        {icon}
      </View>
    </>
  );

  const iconOnly = (
    <>
      <View className="flex items-center justify-center space-x-2">{icon}</View>
    </>
  );

  const textOnly = (
    <>
      <View className="flex items-center justify-center space-x-2">{text}</View>
    </>
  );

  const renderContent = () => {
    switch (buttonType) {
      case "top":
        return iconTop;
      case "bottom":
        return iconBottom;
      case "start":
        return iconStart;
      case "end":
        return iconEnd;
      case "iconOnly":
        return iconOnly;
      case "textOnly":
        return textOnly;
    }
  };

  const ball1 = useRef(new Animated.Value(0)).current;
  const ball2 = useRef(new Animated.Value(0)).current;
  const ball3 = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isLoading || internalLoading) {
      loopRef.current = Animated.loop(
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
        ),
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
    }
    return () => loopRef.current?.stop();
  }, [isLoading, internalLoading]);

  return (
    <Pressable
      className={`
					${extraClasses}
					${disabled || confirmMode ? `${bgColor}/80` : bgColor}
					relative rounded-lg flex items-center justify-center p-1 overflow-hidden
				`}
      disabled={disabled}
      onPress={() => {
        setConfirmMode(true);
      }}
    >
      {/* {renderMainContent()} */}
      {isLoading || internalLoading ? (
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
        renderContent()
      )}

      {confirmMode && (
        <Animated.View
          className="absolute inset-0 px-[5%] z-10 h-full"
          style={{
            opacity: confirmAnim,
            transform: [
              {
                translateY: confirmAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0], // commence 50px en dessous et remonte
                }),
              },
            ],
          }}
        >
          <View className="w-full h-full flex-row items-center justify-center space-x-2">
            <TouchableOpacity
              className={`
								${confirmColor}
								rounded-lg p-1 items-center justify-center w-1/2 h-full	
							`}
              onPress={async () => {
                setConfirmMode(false);
                setInternalLoading(true);
                await onConfirm();
              }}
            >
              <Text className="">Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`
								${cancelColor}
								rounded-lg p-1 items-center justify-center w-1/2 h-full
							`}
              onPress={() => {
                setConfirmMode(false);
              }}
            >
              <Text className="">Non</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}
