import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";

import { SheetManager } from "react-native-actions-sheet";

import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopBar from "../../components/TopBar";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import InputButtonGroup from "../../components/utils/inputs/radioGroup";
import TextBody1 from "../../components/utils/texts/Body1";
import CustomRadioOption from "../../components/utils/buttons/CustomRadioOption";
import InputText from "../../components/utils/inputs/Text";
import TextBody2 from "../../components/utils/texts/Body2";
import networksTools from "../../modules/networksTools";

type PostFrequencyScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostFrequency"
>;

type PostFrequencyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostFrequency"
>;

type Props = {
  navigation: PostFrequencyScreenNavigationProp;
};

export default function PostFrequencyScreen({ navigation }: Props) {
  const route = useRoute<PostFrequencyScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const checkIfHasChanges = (
    newMode: "manual" | "reminder",
    newTimes: string,
  ) => {
    const originalMode =
      shopStore?.socialPostSettings?.frequency?.mode || "manual";
    const originalTimes =
      shopStore?.socialPostSettings?.frequency?.timesPerWeek?.toString() || "0";

    const hasChanged = newMode !== originalMode || newTimes !== originalTimes;
    setHasChanges(hasChanged);
  };

  const [selectedMode, setSelectedMode] = useState<"manual" | "reminder">(
    "manual",
  );
  const [timesPerWeek, setTimesPerWeek] = useState<string>("3");

  useEffect(() => {
    if (shopStore?.socialPostSettings?.frequency) {
      setSelectedMode(shopStore?.socialPostSettings.frequency.mode);
      setTimesPerWeek(
        shopStore?.socialPostSettings.frequency.timesPerWeek.toString(),
      );
    }
  }, [shopStore]);

  const handleSave = async () => {
    setSaveLoading(true);

    try {
      const token = await getToken();

      const values = {
        frequency: {
          mode: selectedMode,
          timesPerWeek: Number(timesPerWeek),
        },
      };

      const updateResponse = await networksTools.updateSocialPostSettings(
        token,
        values,
      );

      if (updateResponse.success && updateResponse.data) {
        dispatch(setShopData(updateResponse.data));

        setHasChanges(false);

        SheetManager.show("alert", {
          payload: {
            message: "Les paramètres de fréquence ont été mis à jour.",
            alertType: "success",
          },
        });
      }
    } catch (error) {
      console.log(`Erreur `, error);
      SheetManager.show("alert", {
        payload: {
          message:
            "Un problème est survenu lors de la mise à jour des paramètres de fréquence.",
          alertType: "error",
        },
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour aux paramètres"}
          screen={from || "PostFrequency"}
          label={screenTitle || "PARAMETRES"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3" style={{ flex: 10 }}>
        <TextBody1
          centered
          extraClasses="my-5 px-5"
        >{`Avec MyApp, vous pouvez poster quand vous voulez. Vous pouvez aussi programmer des rappels pour vous aider à poster.`}</TextBody1>

        <View className="mt-4">
          <CustomRadioOption
            value="manual"
            selected={selectedMode === "manual"}
            onPress={() => {
              setSelectedMode("manual");
              checkIfHasChanges("manual", timesPerWeek);
            }}
            label="Manuel"
          >
            <TextBody2 extraClasses="text-sm text-gray-500 dark:text-gray-400">
              (Vous postez quand vous voulez)
            </TextBody2>
          </CustomRadioOption>

          <CustomRadioOption
            value="reminder"
            selected={selectedMode === "reminder"}
            onPress={() => {
              setSelectedMode("reminder");
              checkIfHasChanges("reminder", timesPerWeek);
            }}
            label="Rappel"
          >
            <View className="flex-row items-center flex-wrap">
              <TextBody2 extraClasses="mr-1">M’inviter à poster</TextBody2>
              <InputText
                keyboardType="numeric"
                value={timesPerWeek}
                size="large"
                onChangeText={(newValue) => {
                  setTimesPerWeek(newValue);
                  checkIfHasChanges(selectedMode, newValue);
                }}
                extraClasses="w-12"
                height="h-[50px]"
                textClasses="font-bold text-center "
              />
              <TextBody2 extraClasses="ml-1">fois par semaine</TextBody2>
            </View>
          </CustomRadioOption>
        </View>
      </View>

      <View
        className="px-3 bg-lightbg dark:bg-darkbg h-full"
        style={{ flex: 1 }}
      >
        <ButtonPrimaryEnd
          label="Sauvegarder"
          iconName="sync-alt"
          iconFamily="FontAwesome5Icon"
          disabled={!hasChanges || isSaveLoading}
          onPressFn={handleSave}
          isLoading={isSaveLoading}
          extraClasses="h-14"
        />
      </View>
    </SafeAreaView>
  );
}
