import React from "react";
import { View, Text } from "react-native";
import fontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";

type StatusIndicatorProps = {
  status: "success" | "error";
  message: string;
  icon: string;
};

export default function StatusIndicator({
  status,
  message,
  icon,
}: StatusIndicatorProps) {
  const bgColor = status === "success" ? "bg-primary/20" : "bg-danger/20";
  const textColor = status === "success" ? "text-primary" : "text-danger";
  const iconName = status === "success" ? "check-circle" : "alert-triangle";
  const iconColor = status === "success" ? "#98B66E" : "#942911";

  return (
    <View className={`rounded-xl p-4 mt-4 flex-row items-center ${bgColor}`}>
      <Feather name={iconName} size={24} color={iconColor} className="mr-3" />
      <Text className={`text-base font-semibold ${textColor} ml-3`}>
        {message}
      </Text>
    </View>
  );
}
