import { TouchableOpacity, View } from "react-native";
import SquareButton from "./buttons/SquareButton";
import { StatusData } from "../../types/API";
import { IconLibraryName } from "../iconLibraries";

type Props = {
  status: StatusData;
  size: number;
  iconSize: number;
  onChange: (s: StatusData) => void;
};

const STATUS_COLORS: Record<
  StatusData,
  { color: string; icon: string; family: IconLibraryName }
> = {
  all: { color: "bg-primary", icon: "list", family: "FontAwesome5Icon" },
  pending: {
    color: "bg-pending",
    icon: "hourglass-half",
    family: "FontAwesome5Icon",
  },
  partialValidated: {
    color: "bg-partialValidated",
    icon: "check-double",
    family: "FontAwesome5Icon",
  },
  validated: {
    color: "bg-validated",
    icon: "check",
    family: "FontAwesome5Icon",
  },
  partialWithdrawn: {
    color: "bg-partialWithdrawn",
    icon: "shopping-basket",
    family: "FontAwesome5Icon",
  },
  withdrawn: {
    color: "bg-withdrawn",
    icon: "shopping-basket",
    family: "FontAwesome5Icon",
  },
  partialCanceled: {
    color: "bg-partialCanceled",
    icon: "ban",
    family: "FontAwesome5Icon",
  },
  canceled: {
    color: "bg-canceled",
    icon: "times-circle",
    family: "FontAwesome5Icon",
  },
};

export default function OrderFilters({
  status,
  onChange,
  size,
  iconSize,
}: Props) {
  return (
    <View className="flex flex-row justify-center gap-x-3">
      {Object.entries(STATUS_COLORS).map(([key, data]) => {
        const isActive = status === key;

        return (
          <View key={key}>
            <SquareButton
              iconName={data.icon}
              iconFamily={data.family}
              iconColor="#fff"
              iconSize={iconSize}
              key={key}
              color={data.color}
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
