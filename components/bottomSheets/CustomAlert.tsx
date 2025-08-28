import React from "react";
import { View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import TextHeading3 from "../utils/texts/Heading3";

export default function CustomAlert(props: SheetProps<"alert">) {
  const insets = useSafeAreaInsets();

  const alertIcon = () => {
    switch (props.payload?.alertType) {
      case "warning":
        return (
          <FontAwesome6Icon
            name="triangle-exclamation"
            size={70}
            color="#ff9d00"
          />
        );
      case "error":
        return (
          <FontAwesome6Icon
            name="circle-exclamation"
            size={70}
            color="#f2170c"
          />
        );
      case "success":
        return (
          <FontAwesome6Icon name="circle-check" size={70} color="#29db11" />
        );
      case "info":
        return (
          <FontAwesome6Icon name="circle-info" size={70} color="#008ffc" />
        );
    }
  };

  return (
    <ActionSheet
      safeAreaInsets={insets}
      indicatorStyle={{ backgroundColor: "#262E20" }}
      containerStyle={{ paddingBottom: insets.bottom }}
      gestureEnabled={true}
      isModal={false}
      id={props.sheetId}
    >
      <View className="p-5 min-h-min w-full flex justify-center items-center bg-white dark:bg-darkbg">
        <View className="mb-3">{alertIcon()}</View>
        <TextHeading3 centered extraClasses="font-extrabold text-xl">
          {props.payload?.message}
        </TextHeading3>
      </View>
    </ActionSheet>
  );
}
