import React, { useState, useEffect } from "react";
import { useSelector, UseDispatch, useDispatch } from "react-redux";
import { addMarket, resetMarkets, ShopState } from "../../../reducers/shop";

import {
  SafeAreaView,
  View,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import TextBody1 from "../../utils/texts/Body1";
import TextHeading4 from "../../utils/texts/Heading4";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import { useColorScheme } from "nativewind";
import Market from "../../cards/Market";
import { MarketData } from "../../../types/API";
import shopTools from "../../../modules/shopTools";

type ManageMarketsModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

type PeriodData = {
  openingTime: string | null;
  closingTime: string | null;
};
type OpeningHourData = {
  day: number;
  periods: PeriodData[];
};

export default function ManageMarketsModal(
  props: ManageMarketsModalProps,
): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [marketPlaces, setMarketPlaces] = useState<JSX.Element[]>([]);
  const [isValidateLoading, setValidateLoading] = useState(false);

  const [marketsDataToSave, setMarketsDataToSave] = useState<
    { market: MarketData; openingHours: OpeningHourData[]; isActive: boolean }[]
  >([]);

  console.log();
  console.log();
  console.log();
  console.log(
    "------------------------------- MANAGEMARKETS --------------------------------------------------------------------",
  );

  // permet d'afficher la liste des markets du shop
  useEffect(() => {
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
      const values = { shopId: shopStore?._id, markets: marketsDataToSave };

      // console.log("values :", JSON.stringify(values, null, 2))

      const data = await shopTools.updateShopMarkets(values);

      if (data.error) {
        Alert.alert("", data.error);
        setValidateLoading(false);
        return;
      } else {
        Alert.alert("Mise à jour des marchés", "Effectuée");
        console.log("databack2: ", JSON.stringify(data, null, 2));
        dispatch(resetMarkets());
        dispatch(addMarket(data.markets));
      }

      setValidateLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("SHOPSTORE MARKETS -> ", JSON.stringify(shopStore?.markets, null, 2));
  // console.log("SHOPSTORE MARKETS -> ", shopStore?.markets);
  // console.log("useEffect market :", JSON.stringify(marketPlaces, null, 2))
  // console.log("highlightedMarketData:", JSON.stringify(highlightedMarketData, null, 2))
  // console.log("marketsDataToSave:", JSON.stringify(marketsDataToSave, null, 2))
  // console.log("marketsDataToSave:", marketsDataToSave)
  // console.log("marketPlaces :", JSON.stringify(marketPlaces, null, 2))

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
            <TextHeading4 centered={true} extraClasses="mb-5">
              {`Gestion des places de marché`}
            </TextHeading4>
            <TextBody1 centered={true} extraClasses="mb-5">
              {`Activez ou désactivez chaque place de marché en cliquant dessus.\nDéfinissez les jours et les horaires où vous êtes présent sur ces places de marché.`}
            </TextBody1>

            {marketPlaces}
          </View>

          <ButtonPrimaryEnd
            label="Valider"
            iconName="refresh"
            disabled={isValidateLoading}
            extraClasses="my-5"
            onPressFn={() => handleValidate()}
            isLoading={isValidateLoading}
          />
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
});
