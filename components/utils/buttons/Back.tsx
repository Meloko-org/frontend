import React from "react";
import { TouchableOpacity, View } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";

type ButtonBackProps = {
  extraClasses?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function ButtonBack(props: ButtonBackProps): JSX.Element {
  return (
    <View
      className={`${props.extraClasses} w-full flex flex-row justify-start items-center pl-4`}
    >
      <TouchableOpacity
        onPress={props.onPressFn}
        className="flex flex-row justify-start items-center"
      >
        <FontAwesome name="arrow-left" size={30} color="#98B66E" />
      </TouchableOpacity>
    </View>
  );
}
