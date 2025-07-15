import React, { JSX, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TagData } from "../../../types/API";

import { Ionicons } from "@expo/vector-icons/";

type KillableTagProps = {
  name: string;
  selected?: boolean;
  extraClasses?: string;
  textClasses?: string;
  onPressFn: () => void;
  onKillFn: () => void;
};

export default function KillableTag({
  name,
  selected,
  extraClasses,
  textClasses,
  onPressFn,
  onKillFn,
}: KillableTagProps): JSX.Element {
  const [toggleOn, setToggleOn] = useState<boolean>(
    selected === true ? selected : false,
  );

  const toggleTag = () => {
    setToggleOn((prev) => !prev);
  };

  return (
    <View className={`${extraClasses} border rounded-lg flex flex-row`}>
      <TouchableOpacity
        onPress={() => {
          toggleTag();
          if (onPressFn) onPressFn();
        }}
      >
        <View
          className={`
					${toggleOn ? "bg-primary" : "bg-gray-300 dark:bg-tertiary"}
					border border-primary rounded-l-lg p-1`}
        >
          <Text
            className={`${textClasses} text-darkbg font-bold dark:text-lightbg text-center`}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-danger flex items-center justify-center w-8 border border-danger rounded-r-lg"
        onPress={onKillFn}
      >
        <Ionicons name="close" size={24} color={"#fff"} style={{}} />
      </TouchableOpacity>
    </View>
  );
}
