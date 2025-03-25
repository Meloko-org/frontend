import React, { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import BadgeGrey from "./utils/badges/Grey";
import SwitchInput from "./utils/inputs/Switch";
import TimeSlot from "./TimeSlot";
import TextBody2 from "./utils/texts/Body2";
import ButtonIcon from "./utils/buttons/Icon";
import TextBody1 from "./utils/texts/Body1";

type ActiveDaysData = {
  [key: string]: boolean;
};
type PeriodData = {
  openingTime: string | null;
  closingTime: string | null;
};
type OpeningHourData = {
  day: number;
  periods: PeriodData[];
};

type PlanningProps = {
  openingHoursValues: OpeningHourData[] | undefined;
  onOpeningHoursChange: (newOpeningHours: OpeningHourData[]) => void;
  open?: boolean | undefined;
};

export default function Planning(props: PlanningProps): JSX.Element {
  const [isOpen, setOpen] = useState(props.open ? props.open : false);

  const toggleAccordion = () => {
    setOpen(!isOpen);
  };

  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const [activeDays, setActiveDays] = useState<ActiveDaysData>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [openingHours, setOpeningHours] = useState<OpeningHourData[]>([
    { day: 1, periods: [{ openingTime: null, closingTime: null }] },
    { day: 2, periods: [{ openingTime: null, closingTime: null }] },
    { day: 3, periods: [{ openingTime: null, closingTime: null }] },
    { day: 4, periods: [{ openingTime: null, closingTime: null }] },
    { day: 5, periods: [{ openingTime: null, closingTime: null }] },
    { day: 6, periods: [{ openingTime: null, closingTime: null }] },
    { day: 7, periods: [{ openingTime: null, closingTime: null }] },
  ]);

  const days: { [key: string]: number } = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  //console.log("------------------------------- PLANNING --------------------------------------------------------------------");

  useEffect(() => {
    if (props.openingHoursValues?.length) {
      const newActiveDays: ActiveDaysData = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };

      props.openingHoursValues.forEach((openingHour) => {
        const hasDefinedPeriods = openingHour.periods.some(
          (period) =>
            period.openingTime !== null && period.closingTime !== null,
        );

        if (hasDefinedPeriods) {
          const dayKey = Object.keys(days).find(
            (key) => days[key] === openingHour.day,
          );
          if (dayKey) {
            newActiveDays[dayKey] = true;
          }
        }
      });

      setActiveDays(newActiveDays);

      setOpeningHours(props.openingHoursValues);
    }
  }, []);

  // permet de faire remonter les openingHours au composant parent
  useEffect(() => {
    props.onOpeningHoursChange(openingHours);
  }, [openingHours, activeDays]);

  const handleToggleDay = (day: string) => {
    setActiveDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
    resetSelectHour(days[day]);
  };

  const handleSelectHour = (
    day: number,
    periodIndex: number,
    type: "openingTime" | "closingTime",
    value: string,
  ) => {
    setOpeningHours((prevState) =>
      prevState.map((dayObject) =>
        dayObject.day === day
          ? {
              ...dayObject,
              periods: dayObject.periods.map((period, index) =>
                index === periodIndex ? { ...period, [type]: value } : period,
              ),
            }
          : dayObject,
      ),
    );
  };

  const resetSelectHour = (day: number) => {
    setOpeningHours((prevState) =>
      prevState.map((dayObject) =>
        dayObject.day === day
          ? {
              ...dayObject,
              periods: [{ openingTime: null, closingTime: null }],
            }
          : dayObject,
      ),
    );
  };

  const handleAddTimeSlot = (day: number) => {
    setOpeningHours((prevState) =>
      prevState.map((dayObject) =>
        dayObject.day === day
          ? {
              ...dayObject,
              periods: [
                ...dayObject.periods,
                { openingTime: null, closingTime: null },
              ],
            }
          : dayObject,
      ),
    );
  };

  const handleRemoveTimeSlot = (day: number, periodIndex: number) => {
    setOpeningHours((prevState) =>
      prevState.map((dayObject) =>
        dayObject.day === day
          ? {
              ...dayObject,
              periods: dayObject.periods.filter(
                (_, index) => index !== periodIndex,
              ),
            }
          : dayObject,
      ),
    );
  };

  // console.log("PLANNING:", JSON.stringify(openingHours, null, 2))
  // console.log("PLANNING:", openingHours)
  // console.log("activeDays:", activeDays.monday)
  // console.log("--------------------------------------------------------------------------------------------------");

  return (
    <View>
      <View className="flex flex-row justify-between items-center cursor-pointer">
        <TextBody1>Jours et horaires</TextBody1>
        <TouchableOpacity onPress={toggleAccordion}>
          <TextBody2>{isOpen ? "Réduire" : "Déplier"}</TextBody2>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View className="overflow-hidden transition-all ease-out duration-300">
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Lundi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.monday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("monday")}
              />
            </View>
            {activeDays.monday &&
              openingHours[0] &&
              openingHours[0].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(1, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(1, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(1)}
                  onPressDel={() => handleRemoveTimeSlot(1, index)}
                  extraClasses=""
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Mardi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.tuesday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("tuesday")}
              />
            </View>
            {activeDays.tuesday &&
              openingHours[1] &&
              openingHours[1].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(2, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(2, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(2)}
                  onPressDel={() => handleRemoveTimeSlot(2, index)}
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Mercredi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.wednesday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("wednesday")}
              />
            </View>
            {activeDays.wednesday &&
              openingHours[2] &&
              openingHours[2].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(3, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(3, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(3)}
                  onPressDel={() => handleRemoveTimeSlot(3, index)}
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Jeudi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.thursday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("thursday")}
              />
            </View>
            {activeDays.thursday &&
              openingHours[3] &&
              openingHours[3].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(4, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(4, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(4)}
                  onPressDel={() => handleRemoveTimeSlot(4, index)}
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Vendredi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.friday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("friday")}
              />
            </View>
            {activeDays.friday &&
              openingHours[4] &&
              openingHours[4].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(5, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(5, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(5)}
                  onPressDel={() => handleRemoveTimeSlot(5, index)}
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Samedi</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.saturday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("saturday")}
              />
            </View>
            {activeDays.saturday &&
              openingHours[5] &&
              openingHours[5].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(6, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(6, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(6)}
                  onPressDel={() => handleRemoveTimeSlot(6, index)}
                />
              ))}
          </View>
          <View className="mx-4 mb-4">
            <View className="flex-row items-center w-full">
              <BadgeGrey extraClasses="flex-1">Dimanche</BadgeGrey>
              <SwitchInput
                thumbColor="#215487"
                label=""
                value={activeDays.sunday}
                extraClasses="w-16 pl-2"
                onValueChange={() => handleToggleDay("sunday")}
              />
            </View>
            {activeDays.sunday &&
              openingHours[6] &&
              openingHours[6].periods.map((period, index) => (
                <TimeSlot
                  key={index}
                  data={hours}
                  trash={index === 0 ? false : true}
                  defaultStartByIndex={period.openingTime || "Select"}
                  defaultEndByIndex={period.closingTime || "Select"}
                  onSelectStart={(selectedItem) => {
                    handleSelectHour(7, index, "openingTime", selectedItem);
                  }}
                  onSelectEnd={(selectedItem) => {
                    handleSelectHour(7, index, "closingTime", selectedItem);
                  }}
                  onPressPlus={() => handleAddTimeSlot(7)}
                  onPressDel={() => handleRemoveTimeSlot(7, index)}
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
}
