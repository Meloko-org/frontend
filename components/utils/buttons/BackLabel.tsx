import React from "react";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import { GestureResponderEvent } from "react-native";
import TextBody1 from "../texts/Body1";

type BackLabelButtonProps = {
  extraClasses?: string;
  backLabel: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function BackLabelButton(
  props: BackLabelButtonProps,
): JSX.Element {
  return (
    <TouchableOpacity onPress={props.onPressFn}>
      <View
        className={`${props.extraClasses} flex flex-row w-auto py-1 items-center rounded-lg bg-darkbg/20 dark:bg-lightbg/25`}
      >
        <View className="pl-2">
          <FontAwesome5Icon name="angle-left" size={30} color="#98B66E" />
        </View>
        <View className="flex-grow">
          <TextBody1 extraClasses="pl-2">{props.backLabel}</TextBody1>
        </View>
      </View>
    </TouchableOpacity>
  );
}
