import React, { JSX, useRef, useState } from "react";

import { TouchableOpacity, View, Animated, Easing } from "react-native";
import TextBody1 from "../texts/Body1";
import { iconLibraries, IconLibraryName } from "../../iconLibraries";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";

import SwitchInput from "../inputs/Switch";

type OpenScreenButtonProps = {
  label: string;
  icon?: string;
  iconFamily?: IconLibraryName;
  iconColor?: string;
  extraClasses?: string;
  bgColor?: string;
  onPressFn: () => void;
  switchProps?: {
    label: string;
    value: boolean;
    onValueChange: (isEnabled: boolean) => void;
    trackColor?: { false: string; true: string };
    thumbColor?: string;
    ios_backgroundColor?: string;
    extraClasses?: string;
  } | null;
  redAlert?: boolean;
  greenAlert?: boolean;
};

export default function OpenMenuButton({
  label,
  icon,
  iconFamily,
  iconColor,
  extraClasses,
  bgColor,
  onPressFn,
  switchProps,
  redAlert,
  greenAlert,
}: OpenScreenButtonProps): JSX.Element {
  const rotationValue = useRef(new Animated.Value(0)).current; // Valeur animée pour la rotation
  const [rotated, setRotated] = useState(false); // État pour savoir si l'icône est déjà pivotée

  // Fonction pour lancer l'animation
  const startAnimation = () => {
    Animated.timing(rotationValue, {
      toValue: rotated ? 0 : 1, // Tourne dans un sens ou l'autre
      duration: 300, // Durée de l'animation
      useNativeDriver: true, // Utilisation du driver natif pour de meilleures performances
      easing: Easing.inOut(Easing.ease), // Animation fluide
    }).start(() => setRotated(!rotated)); // Bascule l'état de rotation une fois l'animation terminée
  };

  // Calcule la rotation en fonction de la valeur animée (0 à 180 degrés)
  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    startAnimation();
    if (onPressFn) onPressFn();
  };

  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  return (
    <TouchableOpacity className={`${extraClasses} `} onPress={handlePress}>
      <View
        className={`flex flex-row w-auto py-4 items-center rounded-lg ${bgColor ? bgColor : "bg-darkbg/20 dark:bg-lightbg/25"}`}
      >
        {switchProps && (
          <View className="w-[60px]">
            <SwitchInput {...switchProps} />
          </View>
        )}
        <View className="flex flex-row flex-grow ml-3">
          <TextBody1>{label}</TextBody1>
          {icon && IconComponent && (
            <IconComponent
              name={icon}
              size={25}
              color="#FFFFFF"
              className={`ml-2 ${iconColor ? `text-${iconColor}` : ""}`}
            />
          )}
        </View>
        <View className="mr-5">
          {redAlert && (
            <View className="bg-danger h-4 w-4 rounded-lg"></View>
            // <FontAwesome5Icon name="exclamation" color="#ff0000" size={20} />
          )}
          {greenAlert && (
            <View className="bg-primary h-4 w-4 rounded-lg"></View>
          )}
        </View>
        <View className="pr-4">
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <FontAwesome6Icon name="angle-down" size={25} color="#98B66E" />
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
