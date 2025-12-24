import React, { JSX } from "react";
import { useState, useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  Easing,
  Text,
  View,
  GestureResponderEvent,
} from "react-native";
import { iconLibraries, IconLibraryName } from "../../iconLibraries";

type MainButtonProps = {
  buttonType:
    | "label-icon-end"
    | "label-icon-start"
    | "label-icon-top"
    | "icon"
    | "label";
  label?: string;
  iconName?: string;
  iconFamily?: IconLibraryName;
  iconColor?: string;
  bgColor?: string;
  extraClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  animated?: boolean;
  iconSize?: number;
  buttonBackground?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function MainButton({
  buttonType,
  label,
  iconName,
  iconFamily,
  iconColor,
  iconSize,
  bgColor,
  extraClasses,
  onPressFn,
  animated,
  disabled,
  isLoading,
}: MainButtonProps): JSX.Element {
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

  const handlePress = (event: GestureResponderEvent) => {
    // Si l'animation est activée via la prop, démarre l'animation
    if (animated) {
      startAnimation();
    }

    // Appelle la fonction onPressFn si elle est passée
    if (onPressFn) {
      onPressFn(event);
    }
  };

  const IconComponent = iconFamily
    ? iconLibraries[iconFamily]
    : iconLibraries["FontAwesome5Icon"];

  // const bgColorDisabled = bgColor && bgColor+"/60"

  const labelIconTop = (
    <TouchableOpacity
      className={`
        ${extraClasses} 
        ${
          disabled
            ? bgColor
              ? bgColor
              : "bg-primary/60"
            : bgColor
              ? bgColor
              : "bg-primary"
        }
        flex rounded-lg justify-center items-center
        `}
      onPress={handlePress}
    >
      {/* Applique la rotation à l'icône via transform */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        {IconComponent && (
          <IconComponent
            name={iconName}
            size={iconSize ? iconSize : 25}
            color={iconColor}
          />
        )}
      </Animated.View>
      <Text className="text-white text-lg/5 text-center">{label}</Text>
    </TouchableOpacity>
  );

  const labelIconEnd = (
    <TouchableOpacity
      className={`
        ${extraClasses} 
        ${
          disabled
            ? bgColor
              ? bgColor
              : "bg-primary/60"
            : bgColor
              ? bgColor
              : "bg-primary/90"
        }
        relative flex flex-row rounded-lg py-1 justify-center items-center px-2
      `}
      onPress={handlePress}
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
          <Text className="text-lightbg text-center font-bold text-[24px]">
            {label}
          </Text>
          {IconComponent && (
            <IconComponent
              name={iconName}
              size={25}
              color="#FFFFFF"
              className="absolute"
              style={{ right: 20 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );

  const icon = (
    <TouchableOpacity
      className={`
        ${extraClasses}
        ${
          disabled
            ? bgColor
              ? bgColor
              : "bg-primary/60"
            : bgColor
              ? bgColor
              : "bg-primary"
        }
        p-1 w-fit
      `}
      onPress={handlePress}
    >
      {/* Applique la rotation à l'icône via transform */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        {IconComponent && (
          <IconComponent
            name={iconName}
            size={iconSize ? iconSize : 25}
            color={iconColor}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  const selectedButton = () => {
    switch (buttonType) {
      case "label-icon-top":
        return labelIconTop;
      case "label-icon-end":
        return labelIconEnd;
      case "icon":
        return icon;
    }
  };

  // console.log(buttonType);

  return <>{selectedButton()}</>;
}
