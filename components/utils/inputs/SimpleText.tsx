import React, { JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";
import { useColorScheme } from "nativewind";

type SimpleInputTextProps = {
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  keyboardType?: undefined | KeyboardTypeOptions;
  textContentType?: TextInputProps["textContentType"];
  autoComplete?: TextInputProps["autoComplete"];
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  onEndEditing?: () => void;
  editable?: boolean;
  value?: string;
  extraClasses?: string;
  height?: string;
  secureTextEntry?: boolean;
  twoLines?: boolean;
  showError?: boolean;
  textClasses?: string;
};

export default function SimpleInputText({
  placeholder,
  autoCapitalize,
  keyboardType,
  textContentType,
  autoComplete,
  onChangeText,
  onBlur,
  onEndEditing,
  editable,
  value,
  extraClasses,
  height = "h-[40px]",
  secureTextEntry,
  twoLines,
  showError,
  textClasses,
}: SimpleInputTextProps): JSX.Element {
  const borderClasses = showError
    ? "border-4 border-danger dark:border-red-500"
    : "border-black dark:border-white";

  return (
    <View
      className={`
        ${extraClasses}
        ${height}
        content-end justify-center rounded-lg border
        ${borderClasses}
        bg-white
      `}
    >
      <TextInput
        value={value}
        className={`
            ${twoLines && "h-[60px] leading-5"}
            ${textClasses}
            text-black h-full rounded-lg
          `}
        placeholder={placeholder}
        placeholderTextColor={"#4d4e4cff"}
        onChangeText={(value) => onChangeText(value)}
        onBlur={() => onBlur?.()}
        onEndEditing={() => onEndEditing?.()}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoComplete={autoComplete}
        multiline={twoLines ?? false}
      />
    </View>
  );
}
