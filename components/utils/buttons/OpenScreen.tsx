import React from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/Navigation";

import { TouchableOpacity, View } from "react-native";
import TextBody1 from "../texts/Body1";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";

type OpenScreenButtonProps = {
  label: string;
  extraClasses?: string;
  screen: keyof RootStackParamList;
};

export default function OpenScreenButton({
  label,
  extraClasses,
  screen,
}: OpenScreenButtonProps): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      className={`${extraClasses} `}
      onPress={() => navigation.navigate(screen)}
    >
      <View className="flex flex-row w-auto py-4 items-center rounded-lg bg-darkbg/20 dark:bg-lightbg/25">
        <View className="flex-grow ml-3">
          <TextBody1>{label}</TextBody1>
        </View>
        <View className="pr-4">
          <FontAwesome6Icon name="angle-right" size={25} color="#98B66E" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
