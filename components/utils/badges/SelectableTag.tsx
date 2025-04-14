import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TagData } from "../../../types/API";

type SelectableTagProps = {
  tag: TagData;
  selected?: boolean;
  extraClasses?: string;
  textClasses?: string;
  onPressFn: () => void;
};

export default function SelectableTag({
  tag,
  selected,
  extraClasses,
  textClasses,
  onPressFn,
}: SelectableTagProps): JSX.Element {
  const [toggleOn, setToggleOn] = useState<boolean>(
    selected === true ? selected : false,
  );

  const toggleTag = () => {
    setToggleOn((prev) => !prev);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        toggleTag();
        if (onPressFn) onPressFn();
      }}
    >
      <View
        className={`
				${extraClasses} 
				${toggleOn ? "bg-gray-500 dark:bg-primary" : "bg-gray-300 dark:bg-tertiary"}
				rounded-lg border border-primary p-1`}
      >
        <Text
          className={`${textClasses} text-darkbg font-bold dark:text-lightbg text-center`}
        >
          {tag.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
