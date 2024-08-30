import React, { useState } from "react";
import {
  View,
  Switch,
  TouchableOpacity,
  SwitchChangeEvent,
} from "react-native";
import TextHeading4 from "../texts/Heading4";
import { GestureResponderEvent } from "react-native";

type SwitchInputProps = {
  trackColor?: {
    false: String;
    true: String;
  };
  thumbColor: String;
  ios_backgroundColor?: String;
  label: String;
  onValueChange?: Function;
  value: boolean;
  extraClasses?: String;
  onPressFn?: ((event: SwitchChangeEvent) => void) | undefined;
};

export default function SwitchInput(props: SwitchInputProps): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  //console.log(isEnabled);

  return (
    <View className={`${props.extraClasses} flex flex-row`}>
      <View
        className={`${isEnabled ? "bg-primary" : "bg-lightbg"} flex justify-center border border-secondary rounded-full w-[50px] h-[26px]`}
      >
        <Switch
          trackColor={{ false: "#FCFFF0", true: "#98B66E" }}
          thumbColor={isEnabled ? "#262E20" : "#262E20"}
          ios_backgroundColor={isEnabled ? "#98B66E" : "#262E20"}
          onValueChange={toggleSwitch}
          onChange={props.onPressFn}
          value={isEnabled}
        />
      </View>
      <TextHeading4 extraClasses="inline pl-3">{`${props.label}`}</TextHeading4>
    </View>
  );
}
