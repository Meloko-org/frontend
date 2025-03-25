import React from "react";

import { TouchableOpacity, View, Text } from "react-native";
import TextBody1 from "./utils/texts/Body1";
import TextBody2 from "./utils/texts/Body2";
import { PeriodData } from "../types/API";

type WeekDayProps = {
  day: number;
  hours: PeriodData[];
  isSelected: boolean;
  isEnabled: boolean;
  onSelect: () => void;
  extraClasses?: string;
};

export default function WeekDay({
  day,
  isSelected,
  isEnabled,
  onSelect,
  extraClasses,
  hours,
}: WeekDayProps): JSX.Element {
  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const formatHours = (periods: PeriodData[]) => {
    return periods
      .filter((period) => period.openingTime && period.closingTime)
      .map((period) => `${period.openingTime} - ${period.closingTime}`)
      .join(", ");
  };

  return (
    <TouchableOpacity
      onPress={() => {
        isEnabled && onSelect();
      }}
    >
      <View
        className={`
					${extraClasses} rounded-lg 
					${!isEnabled ? "border-0 bg-gray-300 dark:bg-tertiary" : isSelected ? "bg-primary" : "bg-gray-300 dark:bg-tertiary dark:border dark:border-primary"}
				`}
      >
        <TextBody1>{weekDays[day - 1]}</TextBody1>
        <TextBody2 centered>{formatHours(hours)}</TextBody2>
      </View>
    </TouchableOpacity>
  );
}
