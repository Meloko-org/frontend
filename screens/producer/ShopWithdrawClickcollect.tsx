import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useDispatch, useSelector } from "react-redux";
import { setClickCollect, ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import shopTools from "../../modules/shopTools";

import { useModal } from "../../context/ModalContext";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import TextBody1 from "../../components/utils/texts/Body1";
import Planning from "../../components/Planning";
import InputTextarea from "../../components/utils/inputs/Textarea";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

type ShopWithdrawClickcollectScreenRouteProp = RouteProp<
  RootStackParamList,
  "ShopWithdrawClickcollect"
>;

type ShopWithdrawClickcollectScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopWithdrawClickcollect"
>;

type Props = {
  navigation: ShopWithdrawClickcollectScreenNavigationProp;
};

export default function ShopWithdrawClickcollectScreen({ navigation }: Props) {
  const route = useRoute<ShopWithdrawClickcollectScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { setAlertMessage } = useModal();

  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

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
    isActive: boolean;
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

  const [refreshKey, setRefreshKey] = useState(0); // pour forcer le rerender de Planning avec les bonnes infos

  useEffect(() => {
    if (shopStore?.clickCollect?.openingHours?.length) {
      const storedOpeningHours = shopStore?.clickCollect?.openingHours || [];
      const updatedOpeningHours = updateOpeningHours(storedOpeningHours);
      setClickCollectHours([...updatedOpeningHours]);
      setRefreshKey((prev) => prev + 1);
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
    // console.log("new :", JSON.stringify(newOpeningHours));
    const updatedOpeningHours = updateOpeningHours(newOpeningHours);
    setClickCollectHours(updatedOpeningHours);
  };

  const handleValidate = async () => {
    try {
      setValidateLoading(true);

      const token: string | null = await getToken();
      const values: ClickCollectValues = {
        instructions,
        isActive: shopStore!.clickCollect!.isActive,
        openingHours: clickCollectHours,
      };

      const shopResponse = await shopTools.updateClickCollect(token, values);

      if (!shopResponse.success && shopResponse.message) {
        setAlertMessage(shopResponse.message, "error");
        setValidateLoading(false);
        return;
      }

      dispatch(setClickCollect(values));
      setAlertMessage("Click&Collect mis à jour", "success");
      setValidateLoading(false);
    } catch (error) {
      console.log(error);
      setValidateLoading(false);
    }
  };

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à l'accueil"}
          screen={from || "Home"}
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="px-3">
            <TextBody1 centered={true} extraClasses="mb-5 px-3">
              {`Définissez ici les jours,\nles horaires d'ouverture\net les conditions du click & collect`}
            </TextBody1>

            <View>
              <Planning
                key={refreshKey} // force le re-render pour mettre à jour Planning
                open={false}
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

              <View className="px-5">
                <ButtonPrimaryEnd
                  label="Sauvegarder"
                  iconName="sync-alt"
                  iconFamily="FontAwesome5Icon"
                  disabled={isValidateLoading}
                  extraClasses="my-5 h-14"
                  onPressFn={() => handleValidate()}
                  isLoading={isValidateLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
