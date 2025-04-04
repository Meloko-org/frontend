import React, { useRef, useState } from "react";

import { TouchableOpacity, View, Animated, Easing } from "react-native";
import TextBody1 from "../texts/Body1";

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

type OpenScreenButtonProps = {
  label: string;
  icon?: string;
  iconFamily?: keyof typeof iconLibraries;
  iconColor?: string;
  extraClasses?: string;
  bgColor?: string;
  onPressFn: () => void;
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

export default function OpenMenuButton({
  label,
  icon,
  iconFamily,
  iconColor,
  extraClasses,
  bgColor,
  onPressFn,
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
    : FontAwesome5Icon;

  return (
    <TouchableOpacity className={`${extraClasses} `} onPress={handlePress}>
      <View
        className={`flex flex-row w-auto py-4 items-center rounded-lg ${bgColor ? bgColor : "bg-darkbg/20 dark:bg-lightbg/25"}`}
      >
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
        <View className="pr-4">
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <FontAwesome6Icon name="angle-down" size={25} color="#98B66E" />
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
