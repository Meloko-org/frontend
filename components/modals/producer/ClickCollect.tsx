import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import shopTools from "../../../modules/shopTools";
import { ClickCollectData, OpeningHoursData } from "../../../types/API";

import { View, Modal, StyleSheet, Alert } from "react-native";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { ShopState, setClickCollect } from "../../../reducers/shop";

import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import TextBody1 from "../../utils/texts/Body1";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import InputTextarea from "../../utils/inputs/Textarea";
import BadgeGrey from "../../utils/badges/Grey";
import Planning from "../../Planning";

type ClickCollectModalProps = {
  data: ClickCollectData;
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

export default function ClickCollectModal(
  props: ClickCollectModalProps,
): JSX.Element {
  const { getToken } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const [isValidateLoading, setValidateLoading] = useState(false);
  const [instructions, setInstructions] = useState<string>(
    shopStore?.clickCollect?.instructions
      ? shopStore?.clickCollect?.instructions
      : "",
  );

  type PeriodData = {
    openingTime: string | null;
    closingTime: string | null;
  };

  type OpeningHourData = {
    day: number;
    periods: PeriodData[];
  };

  type ClickCollectValues = {
    instructions: string | undefined;
    openingHours: OpeningHourData[];
  } | null;

  const [clickCollectHours, setClickCollectHours] = useState<OpeningHourData[]>(
    [
      { day: 1, periods: [{ openingTime: null, closingTime: null }] },
      { day: 2, periods: [{ openingTime: null, closingTime: null }] },
      { day: 3, periods: [{ openingTime: null, closingTime: null }] },
      { day: 4, periods: [{ openingTime: null, closingTime: null }] },
      { day: 5, periods: [{ openingTime: null, closingTime: null }] },
      { day: 6, periods: [{ openingTime: null, closingTime: null }] },
      { day: 7, periods: [{ openingTime: null, closingTime: null }] },
    ],
  );

  useEffect(() => {
    if (shopStore?.clickCollect?.openingHours?.length) {
      const storedOpeningHours = shopStore?.clickCollect?.openingHours || [];

      const updatedOpeningHours = updateOpeningHours(storedOpeningHours);

      setClickCollectHours(updatedOpeningHours);
    }
  }, []);

  const updateOpeningHours = (data: OpeningHourData[]) => {
    return clickCollectHours.map((dayObject) => {
      const dayData = data.find((dayData) => dayData.day === dayObject.day);
      return {
        ...dayObject,
        periods: dayData
          ? dayData.periods.map((period: PeriodData) => ({
              openingTime: period.openingTime || null,
              closingTime: period.closingTime || null,
            }))
          : dayObject.periods,
      };
    });
  };

  const handlePlanningChange = (newOpeningHours: OpeningHourData[]) => {
    console.log("new :", JSON.stringify(newOpeningHours));
    const updatedOpeningHours = updateOpeningHours(newOpeningHours);
    setClickCollectHours(updatedOpeningHours);
  };

  const handleValidate = async () => {
    try {
      setValidateLoading(true);

      const token: string | null = await getToken();
      const values: ClickCollectValues = {
        instructions,
        openingHours: clickCollectHours,
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
  console.log(
    "SHOPSTORE openingHours -> ",
    JSON.stringify(shopStore?.clickCollect?.openingHours, null, 2),
  );
  console.log(
    "clickCollectHours :",
    JSON.stringify(clickCollectHours, null, 2),
  );
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <TextHeading2 centered extraClasses="">
              {`Click & Collect`}
            </TextHeading2>
            <TextBody1 centered={true} extraClasses="mb-5">
              {`Définissez ici les jours, les horaires\nd'ouverture et les conditions du click & collect`}
            </TextBody1>
          </View>
          <View>
            <Planning
              open={true}
              openingHoursValues={clickCollectHours}
              onOpeningHoursChange={handlePlanningChange}
            />

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
});
