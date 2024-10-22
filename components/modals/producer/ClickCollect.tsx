import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import shopTools from "../../../modules/shopTools";

import { SafeAreaView, View, Modal, StyleSheet, Alert } from "react-native";
import { useColorScheme } from "nativewind";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { ShopState, setClickCollect } from "../../../reducers/shop";

import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import TextBody1 from "../../utils/texts/Body1";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import InputTextarea from "../../utils/inputs/Textarea";
import BadgeGrey from "../../utils/badges/Grey";
import SwitchInput from "../../utils/inputs/Switch";
import TimeSlot from "../../TimeSlot";

type ClickCollectModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

export default function ClickCollectModal(
  props: ClickCollectModalProps,
): JSX.Element {
  const { getToken } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;
  const [isValidateLoading, setValidateLoading] = useState(false);
  const [instructions, setInstructions] = useState<string>();

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
  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  type activeDays = {
    [key: string]: boolean;
  };
  const [activeDays, setActiveDays] = useState<activeDays>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  type Period = {
    openingTime: string | null;
    closingTime: string | null;
  };
  type OpeningHour = {
    day: number;
    periods: Period[];
  };
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
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

  type ClickCollectValues = {
    instructions: string | undefined;
    openingHours: OpeningHour[];
  } | null;

  useEffect(() => {
    if (shopStore?.clickCollect) {
      if (shopStore.clickCollect.instructions) {
        setInstructions(shopStore.clickCollect.instructions);
      }

      const storedOpeningHours = shopStore.clickCollect.openingHours || [];

      const updatedOpeningHours = openingHours.map((dayObject) => {
        const storedDay = storedOpeningHours.find(
          (storedDay) => storedDay.day === dayObject.day,
        );

        return {
          ...dayObject,
          periods: storedDay
            ? storedDay.periods.map((period) => ({
                openingTime: period.openingTime || null,
                closingTime: period.closingTime || null,
              }))
            : dayObject.periods, // Conserve les periods initialisés même s'ils n'ont pas été modifiés
        };
      });

      setOpeningHours(updatedOpeningHours);

      const updateActiveDays = {
        monday: storedOpeningHours.some((day) => day.day === 1),
        tuesday: storedOpeningHours.some((day) => day.day === 2),
        wednesday: storedOpeningHours.some((day) => day.day === 3),
        thursday: storedOpeningHours.some((day) => day.day === 4),
        friday: storedOpeningHours.some((day) => day.day === 5),
        saturday: storedOpeningHours.some((day) => day.day === 6),
        sunday: storedOpeningHours.some((day) => day.day === 7),
      };

      setActiveDays(updateActiveDays);
    }
  }, []);

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

  const handleValidate = async () => {
    try {
      setValidateLoading(true);

      // formattage des données pour respecter la structure click&collect
      const formattedOpeningHours = openingHours
        .map((dayObject) => ({
          day: dayObject.day,
          periods: dayObject.periods.filter(
            (period) => period.openingTime && period.closingTime,
          ),
        }))
        .filter((dayObject) => dayObject.periods.length > 0);

      const token: string | null = await getToken();
      const values: ClickCollectValues = {
        instructions,
        openingHours: formattedOpeningHours,
      };

      const data = await shopTools.updateClickCollect(token, values);

      if (data.error) {
        Alert.alert("Mise à jour du shop", data.error);
        setValidateLoading(false);
        return;
      }

      if (data) {
        Alert.alert("Mise à jour du shop", data.message);
        if (data.shop) {
          dispatch(setClickCollect(values));
        }
      }
      setValidateLoading(false);
    } catch (error) {
      console.log(error);
      setValidateLoading(false);
    }
  };

  console.log(
    "------------------------------- CLICKCOLLECT --------------------------------------------------------------------",
  );
  // console.log("SHOPSTORE -> ", JSON.stringify(shopStore, null, 2));
  // console.log("activeDays :", JSON.stringify(activeDays, null, 2));
  // console.log("")
  // console.log("openingHours :", JSON.stringify(openingHours, null, 2));

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView style={bgStyle}>
        <View>
          <ButtonBack
            extraClasses="mb-2"
            onPressFn={() => props.onCloseFn(false)}
          />
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View>
            <TextHeading2 centered extraClasses="">
              {`Click & Collect`}
            </TextHeading2>
            <TextBody1 centered={true} extraClasses="mb-5">
              {`Définissez ici les jours, les horaires\nd'ouverture et les conditions du click & collect`}
            </TextBody1>
          </View>
          <View>
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
                  />
                ))}
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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
            <View style={styles.badgeContainer}>
              <View style={styles.dayrow}>
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

            <InputTextarea
              label="Conditions"
              placeholder="Indications pour le click & collect"
              value={instructions}
              onChangeText={(value: string) => setInstructions(value)}
              extraClasses="my-3 w-full"
            />

            <ButtonPrimaryEnd
              label="Valider"
              iconName="refresh"
              disabled={isValidateLoading}
              extraClasses="my-5"
              onPressFn={() => handleValidate()}
              isLoading={isValidateLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

/* impossible d'appliquer du styling avec la propriété className et des classes tailwind,
		obligé de créer des styles pour styliser en fonction du dark mode
 */
const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: "#262E20",
    padding: 10,
  },
  light: {
    flex: 1,
    backgroundColor: "#FCFFF0",
    padding: 10,
  },
  scrollContainer: {
    height: "80%",
  },
  badgeContainer: {
    // backgroundColor: "#111111",
    marginHorizontal: 16, // Equivalent to mx-4 in Tailwind
    marginBottom: 16,
  },
  dayrow: {
    // height: 50,
    flexDirection: "row", // Equivalent to flex-row
    alignItems: "center",
    width: "100%",
  },
  row: {
    flexDirection: "row", // Equivalent to flex-row
    justifyContent: "space-between",
    marginHorizontal: 16, // Equivalent to mx-4 in Tailwind
  },
  column: {
    width: "50%", // Equivalent to w-1/2 in Tailwind
    paddingHorizontal: 8, // Spacing between the columns
  },
  dropdownButtonStyle: {
    width: 130,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    height: 150,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
});
