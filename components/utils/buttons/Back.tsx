import React from "react";
import { TouchableOpacity, View } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";

type ButtonBackProps = {
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function ButtonBack(props: ButtonBackProps): JSX.Element {
  return (
    <View className="w-full flex flex-row justify-start items-center mb-4 pl-4">
      <TouchableOpacity
        onPress={props.onPressFn}
        className="flex flex-row justify-start items-center"
      >
        <FontAwesome name="arrow-left" size={30} color="#98B66E" />
      </TouchableOpacity>
    </View>
  );
}
