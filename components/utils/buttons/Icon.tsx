import React, { JSX } from "react";
import { useState, useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { GestureResponderEvent } from "react-native";

import { iconLibraries, IconLibraryName } from "../../iconLibraries";

type IconButtonProps = {
  iconName: string;
  iconFamily?: IconLibraryName;
  iconColor?: string;
  buttonColor?: string;
  extraClasses?: string;
  onPressFn:
    | ((event: GestureResponderEvent) => void)
    | ((uri: string) => void)
    | undefined;
  animated?: boolean;
  size?: number;
};

export default function IconButton({
  iconName,
  iconFamily,
  iconColor,
  buttonColor,
  extraClasses,
  onPressFn,
  animated = false,
  size,
}: IconButtonProps): JSX.Element {
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

  return (
    <TouchableOpacity
      className={`${extraClasses} flex flex-row rounded-lg ${buttonColor} justify-center items-center`}
      onPress={handlePress}
    >
      {/* Applique la rotation à l'icône via transform */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        {IconComponent && (
          <IconComponent
            name={iconName}
            size={size ? size : 25}
            color={iconColor}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
