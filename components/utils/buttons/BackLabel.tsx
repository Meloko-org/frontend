import React from "react";
import { TouchableOpacity, View } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody1 from "../texts/Body1";

type BackLabelButtonProps = {
  extraClasses?: string;
  children?: string;
  onPressFn: ((event: GestureResponderEvent) => void) | undefined;
};

export default function BackLabelButton(
  props: BackLabelButtonProps,
): JSX.Element {
  return (
    <TouchableOpacity onPress={props.onPressFn}>
      <View
        className={`${props.extraClasses} flex flex-row w-auto items-center rounded-lg bg-darkbg/25 dark:bg-lightbg/25`}
      >
        <View className="pl-2">
          <FontAwesome name="arrow-left" size={30} color="#98B66E" />
        </View>
        <View className="flex-grow">
          <TextBody1 extraClasses="px-2">{props.children}</TextBody1>
        </View>
      </View>
    </TouchableOpacity>
  );
}
