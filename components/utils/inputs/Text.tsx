import React, { JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;
import { GestureResponderEvent } from "react-native";
import { useColorScheme } from "nativewind";

type InputTextProps = {
  placeholder: string;
  label: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  keyboardType?: null | string;
  textContentType?: string;
  autoComplete?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  editable?: boolean;
  value?: string | Date;
  size?: string;
  extraClasses?: string;
  iconName?: string;
  secureTextEntry?: boolean;
  twoLines?: boolean;
  onIconPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  showError?: boolean;
};

export default function InputText({
  placeholder,
  label,
  autoCapitalize,
  keyboardType,
  textContentType,
  autoComplete,
  onChangeText,
  onBlur,
  editable,
  value,
  size,
  extraClasses,
  iconName,
  secureTextEntry,
  twoLines,
  onIconPressFn,
  showError,
}: InputTextProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const borderClasses = showError
    ? "border-danger"
    : "border-secondary dark:border-primary/20";

  return (
    <View
      className={`
        ${extraClasses}
        h-[70px] flex flex-row rounded-lg px-2 py-1 shadow-sm border 
        ${borderClasses}
        bg-white dark:bg-tertiary
      `}
    >
      <View className={`flex ${iconName ? "w-4/6" : "w-full"}`}>
        <Text
          className={`text-xs font-bold text-secondary/50 uppercase p-0 dark:text-lightbg/50 h-5`}
          // className={`${props.size === "large" ? "text-md" : "text-sm"} font-bold text-secondary/50 uppercase p-0 dark:text-lightbg/50 h-5`}
        >
          {label}
        </Text>
        <TextInput
          value={value}
          className={`
            ${size === "large" ? "text-lg leading-5 h-10" : "text-lg/4 h-8"} 
            ${iconName ? "w-80" : "w-full"} 
            ${twoLines && "h-[60px] leading-5"}
            dark:text-lightbg p-0
          `}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "dark" ? "#FCFFF0" : "#444C3D"}
          onChangeText={(value) => onChangeText(value)}
          onBlur={() => onBlur?.()}
          autoCapitalize={autoCapitalize ? "none" : autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={twoLines ?? false}
        ></TextInput>
      </View>

      {iconName && onIconPressFn && (
        <View className="w-2/6 h-full pr-1">
          <TouchableOpacity
            className="flex flex-row justify-end items-center h-full m-0 p-0"
            onPress={onIconPressFn}
          >
            <FontAwesome name={iconName} size={35} color="#98B66E" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
