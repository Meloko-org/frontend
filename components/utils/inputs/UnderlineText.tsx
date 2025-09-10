import React, { JSX } from "react";
import {
  View,
  TextInput,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";
import { useColorScheme } from "nativewind";

type UnderlineInputTextProps = {
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

export default function UnderlineInputText({
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
  height = "h-[70px]",
  secureTextEntry,
  twoLines,
  showError,
  textClasses,
}: UnderlineInputTextProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const borderClasses = showError
    ? "border-b-4 border-danger"
    : "border-b-2 border-secondary/20 dark:border-primary/20";

  return (
    <View
      className={`
        ${extraClasses}
        ${height}
        flex flex-row
        ${borderClasses}
        bg-lightbg dark:bg-darkbg
      `}
    >
      <TextInput
        value={value}
        className={`
					${twoLines ? "h-[85px] leading-5" : "leading-4"}
					${textClasses}
					text-black dark:text-lightbg p-0
				`}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#FCFFF0" : "#444C3D"}
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
