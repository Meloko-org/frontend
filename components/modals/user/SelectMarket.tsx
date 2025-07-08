import React, { JSX, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { CartState, setWithdrawMarket } from "../../../reducers/cart";

import { MarketsData, MarketData, ShopData } from "../../../types/API";
import shopTools from "../../../modules/shopTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, StyleSheet, View, Text } from "react-native";
import ButtonBack from "../../utils/buttons/Back";
import TextHeading2 from "../../utils/texts/Heading2";
import TextHeading3 from "../../utils/texts/Heading3";
import Market from "../../cards/Market";
import { ScrollView } from "react-native-gesture-handler";
import TextBody1 from "../../utils/texts/Body1";
import WithdrawDays from "../../WithdrawDays";

type SelectMarketModalProps = {
  isVisible: boolean;
  shop: ShopData;
  onCloseFn: (bool: boolean) => void;
};

export default function SelectMarketModal(
  props: SelectMarketModalProps,
): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const dispatch = useDispatch();

  const [markets, setMarkets] = useState<
    { marketData: MarketData; marketsData: MarketsData }[]
  >([]);
  const [highlightedMarket, setHighlightedMarket] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const activeMarkets = props.shop?.markets.filter(
          (m: MarketsData) => m.isActive,
        );

        // console.log("activeMarkets: ", activeMarkets)

        if (activeMarkets) {
          const marketDataPromises = activeMarkets?.map((market) =>
            shopTools.getMarketById(market.market),
          );

          const marketDataResults = await Promise.all(marketDataPromises);

          console.log("marketDataResults :", marketDataResults);

          const combinedData = marketDataResults.map((marketData, index) => ({
            marketData,
            marketsData: activeMarkets[index],
          }));

          setMarkets(combinedData);
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarkets();
  }, [props.shop]);

  // console.log(markets.forEach(market => console.log(JSON.stringify(market.marketsData.openingHours, null, 2))))
  console.log("highlightedMarket :", highlightedMarket);

  console.log("cartStore after day select: ", cartStore);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
        <View style={styles.navBar}>
          <View style={styles.buttonNavBar}>
            <ButtonBack onPressFn={() => props.onCloseFn(false)} />
          </View>
          <View style={styles.titleNavBar}>
            <TextHeading3 centered>Sélection du marché</TextHeading3>
          </View>
        </View>
        <ScrollView>
          <TextBody1 centered>Cliquez pour sélectionner</TextBody1>
          {markets.map(({ marketData, marketsData }) => (
            <View key={marketData._id}>
              <Market
                key={marketData._id}
                marketData={marketData}
                highlightEnable
                radioButtonMode
                showAddress={true}
                displayMode="withdrawMode"
                extraClasses="mb-2 mt-3"
                isRadioButtonActive={highlightedMarket === marketData._id}
                onRadioButtonPress={() => setHighlightedMarket(marketData._id)}
              />
              <WithdrawDays
                openingHours={marketsData.openingHours}
                onDaySelect={(selectedDay) => {
                  console.log(
                    `Jour sélectionné pour le marché ${marketData.name} : ${selectedDay}`,
                  );
                  dispatch(
                    setWithdrawMarket({
                      shopId: props.shop?._id,
                      withdrawMarket: marketData.name,
                      withdrawDay: selectedDay,
                    }),
                  );
                  console.log("dispatch done");
                }}
                extraClasses="mb-5 ml-2"
                isEnabled={highlightedMarket === marketData._id}
              />
            </View>
          ))}
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
  navBar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonNavBar: {
    paddingHorizontal: 10,
  },
  titleNavBar: {
    flexGrow: 1,
  },
});
