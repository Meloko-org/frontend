import React from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/Navigation";

import { TouchableOpacity, View } from "react-native";
import TextBody1 from "../texts/Body1";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import TextHeading4 from "../texts/Heading4";
import SwitchInput from "../inputs/Switch";

type OpenScreenButtonProps = {
  label: string;
  bgColor?: string;
  redAlert?: boolean;
  notice?: string;
  switchProps?: {
    label: string;
    value: boolean;
    onValueChange: (isEnabled: boolean) => void;
    trackColor?: { false: string; true: string };
    thumbColor?: string;
    ios_backgroundColor?: string;
    extraClasses?: string;
  } | null;
  extraClasses?: string;
  onPressFn: () => void;
};

export default function OpenScreenButton({
  label,
  bgColor,
  redAlert,
  notice,
  switchProps = null,
  extraClasses,
  onPressFn,
}: OpenScreenButtonProps): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      className={`${extraClasses} `}
      onPress={() => onPressFn()}
    >
      <View
        className={`${extraClasses} flex flex-row w-auto h-[60px] items-center rounded-lg ${bgColor ? bgColor : "bg-darkbg/20 dark:bg-lightbg/25"}`}
      >
        {switchProps && (
          <View className="w-[60px]">
            <SwitchInput {...switchProps} />
          </View>
        )}
        <View className="grow ml-3">
          <TextBody1>{label}</TextBody1>
        </View>
        {notice && (
          <View className="flex items-center justify-center rounded-lg bg-primary px-1 min-w-[30px] h-8">
            <TextHeading4 centered>{notice}</TextHeading4>
          </View>
        )}

        {redAlert && (
          <View className="ml-5">
            <FontAwesome5Icon
              name="exclamation"
              color="#ff0000"
              size={20}
            ></FontAwesome5Icon>
          </View>
        )}
        <View className="pr-4 ml-5">
          <FontAwesome6Icon name="angle-right" size={25} color="#98B66E" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
