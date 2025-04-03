import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import SwitchInput from "../../components/utils/inputs/Switch";
import TextBody1 from "../../components/utils/texts/Body1";
import InputText from "../../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

type ShopOfflineScreenRouteProp = RouteProp<RootStackParamList, "ShopOffline">;

type ShopOfflineScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopOffline"
>;

type Props = {
  navigation: ShopOfflineScreenNavigationProp;
};

export default function ShopOfflineScreen({ navigation }: Props) {
  const route = useRoute<ShopOfflineScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  /* gestion du switch de désactivation de la boutique */
  const [isReopenDateVisible, setReopenDateVisible] = useState(false);
  const [reopenDate, setReopenDate] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [isShopSaveLoading, setShopSaveLoading] = useState<boolean>(false);

  const handleReopenDate = () => {
    setReopenDateVisible(!isReopenDateVisible);
    setReopenDate(undefined);
  };

  useEffect(() => {
    if (!isReopenDateVisible) setDisabled(true);
  }, [isReopenDateVisible]);

  const handleDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      toggleDatePicker();
      setReopenDate(currentDate.toDateString());
      // if (Platform.OS === "android") {
      //   toggleDatePicker()
      //   setReopenDate(currentDate.toDateString())
      // }
      setDisabled(false);
    } else {
      toggleDatePicker();
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleSaveShop = () => {};

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
          <View className="flex my-5 px-3 items-center">
            <View className="pl-3">
              <SwitchInput
                thumbColor="#215487"
                label="Désactiver la boutique"
                value={isReopenDateVisible}
                extraClasses="pl-5 mb-2"
                onValueChange={handleReopenDate}
              />
            </View>

            {isReopenDateVisible && (
              <View>
                <TextBody1>Sélectionner une date de réouverture</TextBody1>
                <InputText
                  placeholder="Choisissez une date"
                  label="Date de réouverture"
                  editable={false}
                  onChangeText={(value: string) => setReopenDate(value)}
                  value={reopenDate}
                  iconName="calendar"
                  onIconPressFn={toggleDatePicker}
                  size="large"
                />

                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={handleDateChange}
                  />
                )}
              </View>
            )}

            <View className="px-3 w-full mt-5">
              <ButtonPrimaryEnd
                label="Valider"
                iconName="check"
                iconFamily="FontAwesome5Icon"
                disabled={
                  isShopSaveLoading === true ? isShopSaveLoading : isDisabled
                }
                extraClasses="mb-3"
                onPressFn={() => handleSaveShop()}
                isLoading={isShopSaveLoading}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
