import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";

const FontAwesome = _Fontawesome as React.ElementType;

type MenuProps = {
  names: string[];
  type: {
    type: string;
    default: "user";
  };
};

export default function MenuBar(props: MenuProps): JSX.Element {
  {
    /* <TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-end items-center px-4">
			<FontAwesome name="pen" size={30} color="#FFFFFF"/>
			<Text className="text-lightbg">Edit</Text>
		</TouchableOpacity> */
  }

  return <View className="w-full"></View>;
}
