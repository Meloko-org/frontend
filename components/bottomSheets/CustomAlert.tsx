import React, { useRef } from "react";
import { View, Text } from "react-native";
import ActionSheet, {
  SheetProps,
  ActionSheetRef,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import TextHeading3 from "../utils/texts/Heading3";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import TextBody1 from "../utils/texts/Body1";

export default function CustomAlert(props: SheetProps<"alert">) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<ActionSheetRef>(null);

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
      ref={sheetRef}
      safeAreaInsets={insets}
      indicatorStyle={{ backgroundColor: "#262E20" }}
      containerStyle={{ paddingBottom: insets.bottom }}
      gestureEnabled={true}
      isModal={false}
      id={props.sheetId}
    >
      <View className="min-h-min w-full bg-white dark:bg-darkbg">
        <View className="w-full flex items-end pr-3">
          <CloseSheetButton
            onPressFn={() => {
              sheetRef.current?.hide();
            }}
          />
        </View>

        <View className="px-5 pb-5">
          <View className="flex items-center mb-5">{alertIcon()}</View>
          <View className="flex items-center">
            <TextHeading3 centered extraClasses="font-extrabold text-xl">
              {props.payload?.message}
            </TextHeading3>
            {props.payload?.error && (
              <TextBody1 centered>{props.payload.error}</TextBody1>
            )}
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
