import { TouchableOpacity, View } from "react-native";
import SquareButton from "./buttons/SquareButton";
import { StatusData } from "../../types/API";

type Props = {
  status: StatusData;
  size: number;
  onChange: (s: StatusData) => void;
};

const STATUS_COLORS: Record<StatusData, string> = {
  all: "bg-primary",
  pending: "bg-pending",
  partialValidated: "bg-partialValidated",
  validated: "bg-validated",
  partialWithdrawn: "bg-partialWithdrawn",
  withdrawn: "bg-withdrawn",
  partialCanceled: "bg-partialCanceled",
  canceled: "bg-canceled",
};

export default function OrderFilters({ status, onChange, size }: Props) {
  return (
    <View className="flex flex-row justify-center gap-x-3">
      {Object.entries(STATUS_COLORS).map(([key, color]) => {
        const isActive = status === key;

        return (
          <View>
            <SquareButton
              key={key}
              color={color}
              size={size}
              status={key as StatusData}
              isActive={isActive}
              onPressFn={(key) => onChange(key)}
            />
          </View>
        );
      })}
    </View>
  );
}
