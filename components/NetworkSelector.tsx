import { View } from "react-native";
import NetworkSelectableButton from "./utils/buttons/NetworkSelectable";

type NetworkSelectorProps = {
  networks: string[];
  selected: string[];
  onToggle: (network: string) => void;
};

export default function NetworkSelector({
  networks,
  selected,
  onToggle,
}: NetworkSelectorProps) {
  const buttons = networks.map((network, index) => (
    <NetworkSelectableButton
      key={index}
      iconName={network}
      iconFamily="FontAwesome6Icon"
      onPressFn={() => onToggle(network)}
      selected={selected.includes(network)}
      size={30}
      extraClasses=" p-3 mr-2"
    />
  ));

  return (
    <View className="flex flex-row justify-between w-auto">{buttons}</View>
  );
}
