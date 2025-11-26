import { JSX } from "react";

import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";

type Props = {
  onPressFn: () => void;
};

export default function CloseSheetButton({ onPressFn }: Props): JSX.Element {
  return (
    <TouchableOpacity
      className="rounded-full w-10 h-10 flex items-center justify-center bg-tertiary"
      onPress={onPressFn}
    >
      <FontAwesome6Icon name="xmark" size={25} />
    </TouchableOpacity>
  );
}
