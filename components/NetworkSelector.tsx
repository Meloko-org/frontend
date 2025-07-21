import { View } from "react-native";
import NetworkSelectableButton from "./utils/buttons/NetworkSelectable";

type NetworkSelectorProps = {
  networks: string[];
  onPressFn: () => void;
};

export default function NetworkSelector({
  networks,
  onPressFn,
}: NetworkSelectorProps) {
  const buttons = networks.map((network) => (
    <NetworkSelectableButton
      iconName={network}
      iconFamily="FontAwesome6Icon"
      onPressFn={onPressFn}
      selected={false}
      size={30}
      extraClasses=" p-3 mr-2"
    />
  ));

  return (
    <View className="flex flex-row justify-between w-auto">{buttons}</View>
  );
}
