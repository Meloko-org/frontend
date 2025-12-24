import React, { JSX, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ProducerTabParamList,
  RootStackParamList,
  UserTabParamList,
} from "../types/Navigation";

import TextHeading4 from "./utils/texts/Heading4";
import { View, Text, LayoutChangeEvent } from "react-native";
import BackLabelButton from "./utils/buttons/BackLabel";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type TopBarProps = {
  onLayout?: (event: LayoutChangeEvent) => void;
  backLabel: string;
  label: string;
  onBackPress?: () => void;
  screen: keyof RootStackParamList | string;
  screenParams?: object;
  extraClasses?: string;
  navigationOverride?:
    | NativeStackNavigationProp<RootStackParamList>
    | BottomTabNavigationProp<ProducerTabParamList>
    | BottomTabNavigationProp<UserTabParamList>;
};

export default function TopBar({
  onLayout,
  backLabel,
  label,
  onBackPress,
  screen,
  screenParams,
  extraClasses,
  navigationOverride,
}: TopBarProps): JSX.Element {
  const navigation =
    navigationOverride ??
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View
      className={`h-10 flex flex-row justify-between items-center px-2 ${extraClasses}`}
      onLayout={onLayout}
    >
      <View>
        <BackLabelButton
          backLabel={backLabel}
          onPressFn={() => {
            if (onBackPress) {
              onBackPress();
              return;
            }
            if (screenParams) {
              (navigation as any).navigate(
                screen as never,
                screenParams as never,
              );
            } else {
              (navigation as any).navigate(screen as never);
            }
          }}
          extraClasses="ml-1 px-2"
        />
      </View>

      <View className="mr-1">
        <Text className="text-sm text-night dark:text-white text-right leading-4 font-bold">
          {label.toLocaleUpperCase()}
        </Text>
      </View>
    </View>
  );
}
