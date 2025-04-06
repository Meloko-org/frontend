import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { Slider } from "@miblanchard/react-native-slider";
import { useModal } from "../../context/ModalContext";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import MarketSelector from "../../components/cards/MarketSelector";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import TextHeading4 from "../../components/utils/texts/Heading4";
import InputText from "../../components/utils/inputs/Text";
import TextBody2 from "../../components/utils/texts/Body2";
import TextBody1 from "../../components/utils/texts/Body1";
import { useDispatch, useSelector } from "react-redux";
import { addMarket, ShopState } from "../../reducers/shop";
import shopTools from "../../modules/shopTools";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

type ShopWithdrawShopMarketsSearchScreenRouteProp = RouteProp<
  RootStackParamList,
  "ShopWithdrawShopMarketsSearch"
>;

type ShopWithdrawShopMarketsSearchScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    "ShopWithdrawShopMarketsSearch"
  >;

type Props = {
  navigation: ShopWithdrawShopMarketsSearchScreenNavigationProp;
};

export default function ShopWithdrawShopMarketsSearchScreen({
  navigation,
}: Props) {
  const route = useRoute<ShopWithdrawShopMarketsSearchScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { setAlertMessage } = useModal();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [city, setCity] = useState<string>();
  const [radius, setRadius] = useState<number[]>([10]);
  const [marketsList, setMarketsList] = useState<string[]>();
  const [errmess, setErrmess] = useState();

  const [marketSelected, setMarketSelected] = useState<string[]>([]);
  const [isAddMarketLoading, setAddMarketLoading] = useState(false);

  const handleSwitch = (marketId: string, isEnabled: boolean) => {
    setMarketSelected((prevSelected) => {
      if (isEnabled) {
        return [...prevSelected, marketId];
      } else {
        return prevSelected.filter((id) => id !== marketId);
      }
    });
  };

  const onSearchPress = async () => {
    try {
      if (city) {
        const data = await shopTools.getMarkets(city, radius);

        if (data.error) {
          setErrmess(data.error);
        }

        if (data) {
          setMarketsList(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMarket = async () => {
    try {
      setAddMarketLoading(true);
      const values = { shopId: shopStore?._id, marketIds: marketSelected };

      const data = await shopTools.addShopMarkets(values);

      if (data.error) {
        setAlertMessage(data.error, "error");
        setAddMarketLoading(false);
        return;
      }

      if (data) {
        setAlertMessage(data.message, "success");
        dispatch(addMarket(data.markets.markets));
      }

      setAddMarketLoading(false);
      setMarketSelected([]);
      setMarketsList([]);
      setCity("");
      setAlertMessage(
        "Rendez vous sur l'ecran\nprécédent pour paramétrer\nles places de marché que\nvous venez d'ajouter.",
        "success",
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour points de vente"}
          screen={from || "ShopWithdrawShopMarkets"}
          label={screenTitle || "POINTS DE\nVENTE"}
          extraClasses="mt-2"
        />

        <View className="px-3">
          <View>
            <TextHeading4 centered={true} extraClasses="mt-2 mb-5">
              Rechercher des points de vente
            </TextHeading4>

            <InputText
              value={city}
              onChangeText={setCity}
              placeholder="Entrez une ville"
              label="Votre recherche"
              autoCapitalize="none"
              extraClasses="w-full mb-3"
              size="large"
              iconName="search"
              onIconPressFn={onSearchPress}
            />

            <View className="flex flex-row items-center justify-center w-full px-3">
              <View className="flex items-center w-[20%]">
                <TextBody2 extraClasses="" centered>
                  Distance
                </TextBody2>
              </View>
              <View className="flex flex-rox justify-center w-[70%]">
                <Slider
                  containerStyle={{ width: "90%" }}
                  value={radius}
                  step={5}
                  minimumValue={0}
                  maximumValue={100}
                  onValueChange={(value) => setRadius(value)}
                  minimumTrackTintColor="#98B66E"
                  thumbTintColor="#98B66E"
                />
              </View>
              <View className="w-[15%]">
                <TextBody1 className="dark:text-lightbg">{radius} km</TextBody1>
              </View>
            </View>
          </View>

          {marketsList && marketsList.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="mt-5 h-[80%]"
            >
              <View>
                <TextHeading4 centered={true} extraClasses="mb-1">
                  Points de vente trouvés
                </TextHeading4>
                <TextBody2 centered={true} extraClasses="mb-5">
                  Cochez pour sélectionner
                </TextBody2>
                {marketsList.length > 0 ? (
                  marketsList.map((market) => (
                    <MarketSelector
                      key={market._id}
                      market={market}
                      value={marketSelected.includes(market._id)}
                      extraClasses="mb-5"
                      onSwitchChange={(isEnabled) =>
                        handleSwitch(market._id, isEnabled)
                      }
                    />
                  ))
                ) : (
                  <TextBody1 centered={true}>{errmess}</TextBody1>
                )}
              </View>

              <View className="px-5">
                <ButtonPrimaryEnd
                  label="Ajouter"
                  iconName="plus"
                  disabled={isAddMarketLoading}
                  extraClasses="my-5"
                  onPressFn={() => handleAddMarket()}
                  isLoading={isAddMarketLoading}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
