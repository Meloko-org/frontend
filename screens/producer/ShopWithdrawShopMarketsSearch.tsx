import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Slider } from "@miblanchard/react-native-slider";
import { SheetManager } from "react-native-actions-sheet";

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
import { addMarket, setShopData, ShopState } from "../../reducers/shop";
import shopTools from "../../modules/shopTools";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import { MarketData } from "../../types/API";
import Spinner from "../../components/utils/Spinner";

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawShopMarketsSearch"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawShopMarketsSearch"
>;

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawShopMarketsSearchScreen({
  navigation,
  route,
}: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const [city, setCity] = useState<string>();
  const [radius, setRadius] = useState<number[]>([10]);
  const [marketsList, setMarketsList] = useState<MarketData[] | null>();
  const [errmess, setErrmess] = useState();

  const [marketSelected, setMarketSelected] = useState<string[]>([]);
  const [isAddMarketLoading, setAddMarketLoading] = useState(false);
  const [isMarketSearching, setIsMarketSearching] = useState<boolean>(false);

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
      setMarketsList(null);

      if (city) {
        setIsMarketSearching(true);
        const marketResponse = await shopTools.getMarkets(city, radius);
        setIsMarketSearching(false);
        if (!marketResponse.success) {
          SheetManager.show("alert", {
            payload: {
              message: marketResponse.message!,
              alertType: "warning",
            },
          });
          return;
        }

        setMarketsList(marketResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMarket = async () => {
    try {
      setAddMarketLoading(true);
      const token = await getToken();

      const values = {
        marketIds: marketSelected,
      };

      const shopResponse = await shopTools.addShopMarkets(token, values);

      if (!shopResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: shopResponse.message!,
            alertType: "error",
          },
        });
        setAddMarketLoading(false);
        return;
      }

      // SheetManager.show("alert", {
      //   payload: {
      //     message: shopResponse.message!,
      //     alertType: "success",
      //   },
      // });
      dispatch(setShopData(shopResponse.data));

      setAddMarketLoading(false);
      setMarketSelected([]);
      setMarketsList([]);
      setCity("");
      SheetManager.show("alert", {
        payload: {
          message:
            "Rendez vous sur l'ecran\nprécédent pour paramétrer\nles points de vente que\nvous venez d'ajouter.",
          alertType: "success",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour points de vente"}
          screen={
            from ||
            (onboarding
              ? "OnboardingShopWithdrawShopMarkets"
              : "ShopWithdrawShopMarkets")
          }
          label={screenTitle || "POINTS DE\nVENTE"}
          navigationOverride={navigation}
          screenParams={{ onboarding }}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 mt-5" style={{ flex: 11 }}>
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
                <TextBody1 extraClasses="dark:text-lightbg">
                  {radius} km
                </TextBody1>
              </View>
            </View>
          </View>

          {isMarketSearching && (
            <View className="flex items-center mt-5">
              <Spinner />
            </View>
          )}

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
                {marketsList.length > 0 &&
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
                  ))}
              </View>

              <View className="px-5">
                <ButtonPrimaryEnd
                  label="Ajouter"
                  iconName="plus"
                  disabled={isAddMarketLoading}
                  extraClasses="my-5 h-14"
                  onPressFn={() => handleAddMarket()}
                  isLoading={isAddMarketLoading}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
