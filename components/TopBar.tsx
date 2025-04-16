import React from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import TextHeading4 from "./utils/texts/Heading4";
import { View, Text } from "react-native";
import BackLabelButton from "./utils/buttons/BackLabel";

type TopBarProps = {
  backLabel: string;
  label: string;
  screen: keyof RootStackParamList | string;
  screenParams?: object;
  extraClasses?: string;
};

export default function TopBar({
  backLabel,
  label,
  screen,
  screenParams,
  extraClasses,
}: TopBarProps): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View
      className={`${extraClasses} flex flex-row justify-between items-center px-2 mb-5`}
    >
      <View>
        <BackLabelButton
          backLabel={backLabel}
          onPressFn={() =>
            screenParams
              ? navigation.navigate(screen as any, screenParams)
              : navigation.navigate(screen as any)
          }
          extraClasses="ml-1 px-2"
        />
      </View>

      <View className="mr-1">
        <Text className="text-sm text-dark text-right leading-4 font-bold dark:text-white">
          {label.toLocaleUpperCase()}
        </Text>
      </View>
    </View>
  );
}
