import React, { useRef } from "react";
import { FlatList, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
  ScrollView,
} from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";
import MarketSearchResultCard from "../cards/MarketSearchResult";
import { MarketResultData, ShopResultData } from "../../types/API";
import { handleSheetFlow } from "../../helpers/sheetHelpers";

export default function MapMarketResults(
  props: SheetProps<"map-market-results">,
) {
  const markets: MarketResultData[] = props.payload?.resultsList ?? [];
  const navigation = props.payload?.navigation;

  if (!navigation) return;

  const onMarketPress = async (shops: any[]) => {
    // reconstruction d'un objet de type ShopResultData
    const transformedShops: ShopResultData[] = shops.map((shop, index) => {
      const { matchedStocks, ...cleanShop } = shop;
      return {
        shop: cleanShop,
        relevantProducts: shop.matchedStocks ?? [],
        distance: 0,
      };
    });

    await handleSheetFlow({
      sheet: "map-shop-results",
      payload: {
        resultsList: transformedShops,
        navigation,
        onBackFn: () => {
          handleSheetFlow({
            sheet: "map-market-results",
            payload: {
              resultsList: markets,
              navigation,
            },
          });
        },
      },
    });
  };

  return (
    <ActionSheet
      backgroundInteractionEnabled={true}
      isModal={false}
      snapPoints={[25, 50, 75]}
      initialSnapIndex={1}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
      ref={(ref) => {
        if (ref) {
          SheetManager.registerRef("map-market-results", "global", {
            current: ref,
          });
        }
      }}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        <View className="px-3 w-full">
          <TextHeading4 centered extraClasses="my-3 h-10">
            {`${props.payload?.resultsList.length.toString()} Point(s) de vente`}
          </TextHeading4>
        </View>

        <FlatList
          data={markets}
          keyExtractor={(item) => item.market!._id}
          showsVerticalScrollIndicator={false}
          style={{ flex: 0.3, width: "100%" }}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <MarketSearchResultCard
              marketData={item.market}
              results={item.shops}
              distance={item.distance}
              onPressFn={() => onMarketPress(item.shops)}
              key={item?.market?._id}
              extraClasses="mb-1"
            />
          )}
        />

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 0.3, width: "100%" }}
          className="px-3"
        >
          {props.payload?.resultsList}
        </ScrollView> */}
      </View>
    </ActionSheet>
  );
}
