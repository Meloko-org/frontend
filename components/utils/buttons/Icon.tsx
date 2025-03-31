import React from "react";
import { useState, useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { GestureResponderEvent } from "react-native";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";

type ButtonIconProps = {
  iconName: string;
  extraClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
  animated?: boolean;
  size?: number;
};

export default function ButtonIcon(props: ButtonIconProps): JSX.Element {
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
    if (props.animated) {
      startAnimation();
    }

    // Appelle la fonction onPressFn si elle est passée
    if (props.onPressFn) {
      props.onPressFn(event);
    }
  };

  return (
    <TouchableOpacity
      className={`${props.extraClasses} flex flex-row rounded-lg shadow-sm py-1 justify-center items-center`}
      onPress={handlePress}
    >
      {/* Applique la rotation à l'icône via transform */}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <FontAwesome5Icon
          name={props.iconName}
          size={props.size ? props.size : 25}
          color="#FFFFFF"
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
