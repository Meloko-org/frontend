import React from "react";
import { View, Text } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import TextHeading3 from "../utils/texts/Heading3";
import PrimaryButton from "../utils/buttons/Primary";
import SecondaryButton from "../utils/buttons/Secondary";

export default function ConfirmSheet(props: SheetProps<"confirm">) {
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
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="p-5 min-h-min w-full flex justify-center items-center bg-white dark:bg-darkbg">
        <View className="mb-3">{alertIcon()}</View>
        <TextHeading3 centered extraClasses="font-extrabold text-xl">
          {props.payload?.message}
        </TextHeading3>
        <View className="flex flex-row w-[50%] justify-around mt-5">
          <SecondaryButton
            label="Annuler"
            onPressFn={() => {
              SheetManager.hide(props.sheetId, {
                payload: false,
              });
            }}
            extraClasses="h-12 px-2"
          />
          <PrimaryButton
            label="OK"
            onPressFn={() => {
              SheetManager.hide(props.sheetId, {
                payload: true,
              });
            }}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
