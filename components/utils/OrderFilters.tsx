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
  "partially-ready": {
    color: "bg-partialValidated",
    icon: "check-double",
    family: "FontAwesome5Icon",
  },
  ready: {
    color: "bg-validated",
    icon: "check",
    family: "FontAwesome5Icon",
  },
  completed: {
    color: "bg-partialWithdrawn",
    icon: "shopping-basket",
    family: "FontAwesome5Icon",
  },
  cancelled: {
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
