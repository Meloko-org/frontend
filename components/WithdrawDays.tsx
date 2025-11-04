import React, { JSX, useEffect, useState } from "react";
import { View } from "react-native";
import WeekDay from "./WeekDay";
import { OpeningHourData } from "../types/API";

type WithdrawDaysProps = {
  openingHours: OpeningHourData[];
  onDaySelect: (day: number) => void;
  isEnabled: boolean;
  highlightedDay?: number | null;
  extraClasses?: string;
};

export default function WithdrawDays({
  openingHours,
  onDaySelect,
  isEnabled,
  highlightedDay,
  extraClasses,
}: WithdrawDaysProps): JSX.Element {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (highlightedDay) setSelectedDay(highlightedDay);
  }, [highlightedDay]);

  const getCurrentDayIndex = () => {
    const currentDate = new Date();
    return currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  };

  const sortDaysByCurrent = (days: OpeningHourData[]) => {
    const currentDayIndex = getCurrentDayIndex();
    const dayOrder = [
      ...days.slice(currentDayIndex),
      ...days.slice(0, currentDayIndex),
    ].map((d) => d.day);

    const sortedDays = days.sort(
      (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
    );

    const currentDay = sortedDays.find((d) => d.day === currentDayIndex + 1);
    if (currentDay) {
      const filteredDays = sortedDays.filter((d) => d.day !== currentDay.day);
      return [...filteredDays, currentDay];
    }

    return sortedDays;
  };

  const daysOfSale = sortDaysByCurrent(
    openingHours.filter((dayInfos) =>
      dayInfos.periods.some(
        (period) => period.openingTime !== null && period.closingTime !== null,
      ),
    ),
  );

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    onDaySelect(day);
  };

  return (
    <View className={`${extraClasses} "flex flex-row flex-wrap"`}>
      {daysOfSale.map((dayInfo) => (
        <WeekDay
          key={dayInfo.day}
          day={dayInfo.day}
          hours={dayInfo.periods}
          isSelected={selectedDay === dayInfo.day}
          onSelect={() => handleSelectDay(dayInfo.day)}
          extraClasses="px-2 py-1 mr-2"
          isEnabled={isEnabled}
        />
      ))}
    </View>
  );
}
