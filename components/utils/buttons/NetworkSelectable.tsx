import React, { JSX } from "react";
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

type NetworkSelectableButtonProps = {
  iconName: string;
  iconFamily?: keyof typeof iconLibraries;
  extraClasses?: string;
  selected: boolean;
  onPressFn: (event: GestureResponderEvent) => void;
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

export default function NetworkSelectableButton({
  iconName,
  iconFamily,
  extraClasses,
  selected,
  onPressFn,
  size,
}: NetworkSelectableButtonProps): JSX.Element {
  const [toggleOn, setToggleOn] = useState<boolean>(
    selected === true ? selected : false,
  );

  const toggleButton = () => {
    setToggleOn((prev) => !prev);
  };

  const handlePress = (event: GestureResponderEvent) => {
    toggleButton();
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
      className={`
				${extraClasses} 
				flex flex-row border border-primary rounded-lg justify-center items-center
				${toggleOn ? "bg-primary" : "bg-tertiary"}
			`}
      onPress={handlePress}
    >
      {IconComponent && (
        <IconComponent
          name={iconName}
          size={size ? size : 25}
          color={"white"}
        />
      )}
    </TouchableOpacity>
  );
}
