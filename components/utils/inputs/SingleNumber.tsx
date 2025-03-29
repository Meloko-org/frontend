import { forwardRef } from "react";
import { TextInput, View } from "react-native";

type SingleNumberProps = {
  value: string;
  onChange: (digit: string) => void;
  onBackspace: () => void;
  hasBeenFocused: boolean;
  isFocused: boolean;
  extraClasses?: string;
};

const SingleNumber = forwardRef<TextInput, SingleNumberProps>(
  (
    { value, onChange, onBackspace, isFocused, hasBeenFocused, extraClasses },
    ref,
  ) => {
    return (
      <View
        className={`${extraClasses} w-12 h-18 flex items-center justify-center rounded-lg p-1 border border-2 
			${isFocused || hasBeenFocused ? "border-tertiary dark:border-white" : "border-tertiary/20 dark:border-white/20"} 
			bg-white dark:bg-tertiary`}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={(text) => {
            if (/^\d$/.test(text)) {
              onChange(text);
            }
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace") {
              onBackspace();
            }
          }}
          keyboardType="numeric"
          maxLength={1}
          className="text-3xl text-center text-black dark:text-white"
        ></TextInput>
      </View>
    );
  },
);

export default SingleNumber;
