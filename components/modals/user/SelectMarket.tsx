import React, { JSX, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import {
  CartState,
  setWithdrawMarket,
  updateWithdrawMode,
} from "../../../reducers/cart";

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
import BackLabelButton from "../../utils/buttons/BackLabel";

type SelectMarketModalProps = {
  isVisible: boolean;
  shop: ShopData;
  onCloseFn: (bool: boolean) => void;
};

export default function SelectMarketModal({
  isVisible,
  shop,
  onCloseFn,
}: SelectMarketModalProps): JSX.Element {
  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );

  const [markets, setMarkets] = useState<MarketsData[]>([]);
  const [highlightedMarket, setHighlightedMarket] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (shop) {
      const activeMarkets = shop!.markets.filter(
        (m: MarketsData) => m.isActive,
      );
      setMarkets(activeMarkets);

      const cartShop = cartStore.find((c) => c.shop?._id === shop?._id);
      if (
        cartShop?.withdrawMode === "market" &&
        cartShop.withdrawMarket &&
        cartShop.withdrawDay
      ) {
        console.log("not youpi");
        const marketToHighlight = activeMarkets.find(
          (m) => m.market.name === cartShop.withdrawMarket,
        );
        if (marketToHighlight)
          setHighlightedMarket(marketToHighlight.market._id);
      } else {
        console.log("youpi");
        setHighlightedMarket(null);
      }
    }
  }, [shop, isVisible]);

  console.log("---------------- SELECTMARKETMODAL ------------------------");

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={() => {
        onCloseFn(!isVisible);
      }}
    >
      <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
        <View className="h-10 flex flex-row justify-start items-center pl-3 mt-2 mb-5">
          <BackLabelButton
            backLabel="Retour"
            onPressFn={() => {
              const cartShop = cartStore.find((c) => c.shop?._id === shop?._id);

              if (!cartShop?.withdrawMarket && !cartShop?.withdrawDay) {
                if (cartShop?.withdrawMode === "clickCollect") {
                  dispatch(
                    updateWithdrawMode({
                      shopId: shop!._id,
                      withdrawMode: "clickCollect",
                      withdrawMarket: null,
                      withdrawDay: null,
                    }),
                  );
                } else {
                  dispatch(
                    updateWithdrawMode({
                      shopId: shop!._id,
                      withdrawMode: null,
                      withdrawMarket: null,
                      withdrawDay: null,
                    }),
                  );
                }
              }
              onCloseFn(false);
            }}
            extraClasses="pr-2"
          />
        </View>

        <ScrollView>
          <View className="px-3">
            <TextHeading3 centered>Sélection du point de vente</TextHeading3>
            <TextBody1 centered>Cliquez pour sélectionner</TextBody1>

            {markets.map((data) => (
              <View key={data._id}>
                <Market
                  key={data.market._id}
                  marketData={data.market}
                  highlightEnable
                  radioButtonMode
                  showAddress={true}
                  displayMode="withdrawMode"
                  extraClasses="mb-2 mt-3"
                  isRadioButtonActive={highlightedMarket === data.market._id}
                  onRadioButtonPress={() =>
                    setHighlightedMarket(data.market._id)
                  }
                />
                <WithdrawDays
                  openingHours={data.openingHours}
                  onDaySelect={(selectedDay) => {
                    console.log(
                      `Jour sélectionné pour le marché ${data.market.name} : ${selectedDay}`,
                    );
                    dispatch(
                      updateWithdrawMode({
                        shopId: shop!._id,
                        withdrawMode: "market",
                      }),
                    );
                    dispatch(
                      setWithdrawMarket({
                        shopId: shop!._id,
                        withdrawMarket: data.market.name,
                        withdrawDay: selectedDay,
                      }),
                    );
                    console.log("dispatch done");
                  }}
                  isEnabled={highlightedMarket === data.market._id}
                  highlightedDay={
                    highlightedMarket === data.market._id
                      ? cartStore.find((c) => c.shop?._id === shop?._id)
                          ?.withdrawDay || null
                      : null
                  }
                  extraClasses="mb-5 ml-2"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
