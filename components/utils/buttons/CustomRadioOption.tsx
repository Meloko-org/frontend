import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextBody1 from "../texts/Body1";

type CustomRadioOptionProps = {
  value: string;
  selected: boolean;
  onPress: () => void;
  label: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

export default function CustomRadioOption({
  value,
  selected,
  onPress,
  label,
  children,
  disabled = false,
}: CustomRadioOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-start mb-4 px-4 py-2 rounded-lg ${
        selected
          ? "bg-primary/10 border border-primary"
          : "bg-white dark:bg-darkbg border"
      }`}
    >
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={24}
        color={selected ? "#98B66E" : "#999"}
        style={{ marginTop: 4, marginRight: 12 }}
      />

      <View className="flex-1">
        <TextBody1 extraClasses="text-base font-semibold text-dark dark:text-light">
          {label}
        </TextBody1>
        {children && <View className="mt-1">{children}</View>}
      </View>
    </Pressable>
  );
}
