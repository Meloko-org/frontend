import React from "react";
import { View, Text } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";

export default function CustomAlert(props: SheetProps<"alert">) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const alertIcon = () => {
    switch (props.payload?.alertType) {
      case "warning":
        return (
          <FontAwesome6Icon
            name="triangle-exclamation"
            size="70"
            color="#ff9d00"
          />
        );
      case "error":
        return (
          <FontAwesome6Icon
            name="circle-exclamation"
            size="70"
            color="#f2170c"
          />
        );
      case "success":
        return (
          <FontAwesome6Icon name="circle-check" size="70" color="#29db11" />
        );
    }
  };

  return (
    <ActionSheet
      snapPoints={[100]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="p-5 min-h-min w-full flex justify-center items-center">
        <View className="mb-3">{alertIcon()}</View>
        <Text className="font-extrabold text-xl">{props.payload?.message}</Text>
      </View>
    </ActionSheet>
  );
}
