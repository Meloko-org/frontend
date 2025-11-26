import React, { JSX } from "react";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import { GestureResponderEvent } from "react-native";
import TextBody1 from "../texts/Body1";

type BackLabelButtonProps = {
  extraClasses?: string;
  backLabel: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function BackLabelButton({
  backLabel,
  onPressFn,
  extraClasses,
}: BackLabelButtonProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPressFn}>
      <View
        className={`${extraClasses} flex flex-row w-auto py-1 items-center rounded-lg bg-darkbg/20 dark:bg-lightbg/25`}
      >
        <View className="pl-2">
          <FontAwesome5Icon name="angle-left" size={30} color="#98B66E" />
        </View>
        <View className="flex-grow mr-2">
          <TextBody1 extraClasses="pl-2">{backLabel}</TextBody1>
        </View>
      </View>
    </TouchableOpacity>
  );
}
