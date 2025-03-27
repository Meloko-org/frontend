import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";

type CheckBoxProps = {
  label: string;
  extraClasses?: string;
  bgColor?: string;
  textClasses?: string;
  onPressFn?: () => void;
};

export default function CheckBox({
  label,
  extraClasses,
  bgColor,
  textClasses,
  onPressFn,
}: CheckBoxProps): JSX.Element {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleCheck = () => {
    setIsChecked((prev) => !prev);
    if (onPressFn) onPressFn();
  };

  return (
    <TouchableOpacity onPress={toggleCheck}>
      <View
        className={`${extraClasses} ${bgColor} flex flex-row rounded-lg items-center py-2 px-3`}
      >
        <View>
          {!isChecked ? (
            <FontAwesome6Icon name="square" size={32} color="#98b66E" />
          ) : (
            <FontAwesome6Icon name="square-check" size={32} color="#98b66E" />
          )}
        </View>
        <View className="flex-grow">
          <Text className={`${textClasses} pl-3`}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
