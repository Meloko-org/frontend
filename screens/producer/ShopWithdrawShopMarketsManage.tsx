import React, { JSX } from "react";
import { useState, useEffect } from "react";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SheetManager } from "react-native-actions-sheet";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextBody1 from "../../components/utils/texts/Body1";
import { useDispatch, useSelector } from "react-redux";
import { addMarket, resetMarkets, ShopState } from "../../reducers/shop";
import { MarketData } from "../../types/API";
import Market from "../../components/cards/Market";
import shopTools from "../../modules/shopTools";

type PeriodData = {
  openingTime: string | null;
  closingTime: string | null;
};
type OpeningHourData = {
  day: number;
  periods: PeriodData[];
};

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawShopMarketsManage"
> & {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawShopMarketsManage"
> & {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawShopMarketsManageScreen({
  navigation,
  route,
  isVisible,
  onCloseFn,
}: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [marketPlaces, setMarketPlaces] = useState<JSX.Element[]>([]);
  const [isValidateLoading, setValidateLoading] = useState(false);

  const [marketsDataToSave, setMarketsDataToSave] = useState<
    {
      market: MarketData;
      openingHours: OpeningHourData[];
      isActive: boolean;
    }[]
  >([]);

  // permet d'afficher la liste des markets du shop
  useEffect(() => {
    // console.log(
    //   "shopstore.markets:",
    //   JSON.stringify(shopStore.markets, null, 2),
    // );
    if (shopStore?.markets) {
      const markets = shopStore?.markets.map(
        ({ market, openingHours, isActive }) => (
          <Market
            key={market._id}
            marketData={market}
            openingHoursData={openingHours}
            isActiveData={isActive}
            highlightEnable={true}
            showAddress={true}
            extraClasses="mb-5"
            planning={true}
            onMarketDataChange={updateMarketsDataToSave}
          />
        ),
      );
      setMarketPlaces(markets);

      setMarketsDataToSave(shopStore.markets);
    }
  }, [shopStore?.markets]);

  const updateMarketsDataToSave = (newMarketData: {
    market: MarketData;
    openingHours: OpeningHourData[];
    isActive: boolean;
  }) => {
    // console.log("updateMarketsDataTosave ", JSON.stringify(newMarketData, null, 2))
    setMarketsDataToSave((prevData) => {
      const existingMarket = prevData?.find(
        (data) => data.market._id === newMarketData.market._id,
      );
      if (existingMarket) {
        return prevData?.map((data) =>
          data.market._id === newMarketData.market._id
            ? {
                market: newMarketData.market,
                openingHours: newMarketData.openingHours,
                isActive: newMarketData.isActive,
              }
            : data,
        );
      } else {
        return [
          ...prevData,
          {
            market: newMarketData.market,
            openingHours: newMarketData.openingHours,
            isActive: newMarketData.isActive,
          },
        ];
      }
    });
  };

  const handleValidate = async () => {
    try {
      setValidateLoading(true);
      // enregistrer les données
      const values = {
        shopId: shopStore?._id,
        markets: marketsDataToSave,
      };

      // console.log("values :", JSON.stringify(values, null, 2))

      const shopMarketsResponse = await shopTools.updateShopMarkets(values);

      if (!shopMarketsResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: shopMarketsResponse.message,
            alertType: "warning",
          },
        });
        setValidateLoading(false);
        return;
      }

      console.log("shopMarketsResponse :", shopMarketsResponse.data);

      dispatch(resetMarkets());
      dispatch(addMarket(shopMarketsResponse.data.markets));
      SheetManager.show("alert", {
        payload: {
          message: "Mise à jour des points de vente effectuée",
          alertType: "success",
        },
      });

      setValidateLoading(false);
    } catch (error) {
      console.log(error);
      setValidateLoading(false);
    }
  };

  console.log("markets :", shopStore?.markets);

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour points de vente"}
          screen={
            from || onboarding
              ? "OnboardingShopWithdrawShopMarkets"
              : "ShopWithdrawShopMarkets"
          }
          label={screenTitle || "POINTS DE\nVENTE"}
          navigationOverride={navigation}
          screenParams={{ onboarding }}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 mt-5" style={{ flex: 11 }}>
        <ScrollView>
          <View className="px-3">
            <View>
              <TextBody1 centered={true} extraClasses="mb-5">
                {`Activez ou désactivez un point de vente\nen cliquant dessus.\nDéfinissez les jours et les horaires où vous êtes présent sur ces places de marché.`}
              </TextBody1>

              {marketPlaces}
            </View>

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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
