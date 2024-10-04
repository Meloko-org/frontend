import React from "react";
import { TouchableOpacity } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";

type ButtonIconProps = {
  iconName: string;
  extraClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function ButtonIcon(props: ButtonIconProps): JSX.Element {
  return (
    <TouchableOpacity
      className={`${props.extraClasses} flex flex-row rounded-lg shadow-sm py-1 justify-center items-center`}
      onPress={props.onPressFn}
    >
      <FontAwesome name={props.iconName} size={25} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
