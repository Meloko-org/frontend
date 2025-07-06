import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setIsSearchActive,
  setSelectedMarketId,
  mapMarketResultsState,
} from "../../reducers/mapMarketResults";

import { FlatList, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
  ScrollView,
} from "react-native-actions-sheet";
import TextHeading4 from "../utils/texts/Heading4";
import MarketSearchResultCard from "../cards/MarketSearchResult";
import { MarketResultData, ShopResultData } from "../../types/API";
import { handleSheetFlow } from "../../helpers/sheetHelpers";

export default function MapMarketResults(
  props: SheetProps<"map-market-results">,
) {
  const dispatch = useDispatch();
  const selectedMarketId = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.selectedMarketId,
  );

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const flatListRef = useRef<FlatList>(null);
  const [snapIndex, setSnapIndex] = useState(0);

  const isMarketSheetActiveRef = useRef(false);

  const getFlatListHeight = () => {
    switch (snapIndex) {
      case 0:
        return "35%"; // 25%
      case 1:
        return "40%"; // 50%
      case 2:
        return "100%"; // 100%
      default:
        return "35%";
    }
  };

  const mapSearchBoxRef = props.payload!.mapSearchBoxRef;

  const markets: MarketResultData[] = props.payload?.resultsList ?? [];
  const navigation = props.payload?.navigation;

  if (!navigation) return;

  // on enregistre la ref de l'actionSheet globalement pour être utilisée depuis un autre composant
  useEffect(() => {
    if (actionSheetRef.current) {
      SheetManager.registerRef(
        "map-shop-results",
        "global",
        actionSheetRef as React.RefObject<ActionSheetRef>,
      );
    }
  }, []);

  // on vide selectedMarketId
  useEffect(() => {
    return () => {
      dispatch(setSelectedMarketId(null));
    };
  }, []);

  useEffect(() => {
    if (selectedMarketId) {
      const index = props.payload?.resultsList.findIndex(
        (result) => result.market?._id === selectedMarketId,
      );

      if (index !== -1) {
        flatListRef.current?.scrollToIndex({
          index: Number(index),
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedMarketId]);

  const onMarketPress = async (shops: any[]) => {
    isMarketSheetActiveRef.current = true;
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
        mapSearchBoxRef,
        onBackFn: () => {
          handleSheetFlow({
            sheet: "map-market-results",
            payload: {
              resultsList: markets,
              navigation,
              mapSearchBoxRef,
            },
          });
        },
      },
    });
  };

  return (
    <ActionSheet
      backgroundInteractionEnabled={true}
      onSnapIndexChange={(index) => setSnapIndex(index)}
      isModal={false}
      snapPoints={[25, 50, 100]}
      initialSnapIndex={1}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      enableGesturesInScrollView={true}
      overdrawEnabled={false}
      closeOnPressBack={true}
      onClose={() => {
        console.log(
          "MAPMARKETRESULTS : onClose marketSheetActive :",
          isMarketSheetActiveRef,
        );
        if (isMarketSheetActiveRef.current === false) {
          console.log("youpi");
          dispatch(setIsSearchActive(false));
          console.log(
            "marketsheet : mapsearchboxRef :",
            props.payload?.mapSearchBoxRef.current,
          );
          props.payload?.mapSearchBoxRef.current?.openSearch();
        }
      }}
      onOpen={() => dispatch(setIsSearchActive(true))}
      id={props.sheetId}
      ref={actionSheetRef}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        <View className="px-3 w-full">
          <TextHeading4 centered extraClasses="my-3 h-10">
            {`${props.payload?.resultsList.length.toString()} Point(s) de vente`}
          </TextHeading4>
        </View>

        <View className={`h-[${getFlatListHeight()}]`}>
          <FlatList
            data={markets}
            keyExtractor={(item) => item.market!._id}
            showsVerticalScrollIndicator={false}
            style={{ height: getFlatListHeight(), width: "100%" }}
            ListFooterComponent={<View style={{ height: 30 }} />}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => (
              <MarketSearchResultCard
                marketData={item.market}
                results={item.shops}
                distance={item.distance}
                onPressFn={() => onMarketPress(item.shops)}
                key={item?.market?._id}
                isHighlighted={item.market?._id === selectedMarketId}
                extraClasses="mb-1"
              />
            )}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
