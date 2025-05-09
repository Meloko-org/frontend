import React from "react";
import { useState, useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
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

type IconButtonProps = {
  iconName: string;
  iconFamily?: keyof typeof iconLibraries;
  iconColor?: string;
  buttonColor?: string;
  extraClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  animated?: boolean;
  size?: number;
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

export default function IconButton({
  iconName,
  iconFamily,
  iconColor,
  buttonColor,
  extraClasses,
  onPressFn,
  animated,
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
    : FontAwesome5Icon;

  return (
    <TouchableOpacity
      className={`${extraClasses} flex flex-row rounded-lg ${buttonColor} p-1 justify-center items-center`}
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
