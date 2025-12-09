import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setIsMarketSearchActive,
  setSelectedMarketId,
  mapMarketResultsState,
} from "../../reducers/mapMarketResults";

import { FlatList as RNFlatList, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
  FlatList,
  ScrollView,
} from "react-native-actions-sheet";
import TextHeading4 from "../utils/texts/Heading4";
import MarketSearchResultCard from "../cards/MarketSearchResult";
import { MarketResultData, ShopResultData } from "../../types/API";
import { handleSheetFlow } from "../../helpers/sheetHelpers";
import { clearMarketResultsList } from "../../reducers/mapMarketResults";
import {
  clearShopResultsList,
  setShopResultsList,
} from "../../reducers/mapShopResults";

export default function MapMarketResults(
  props: SheetProps<"map-market-results">,
) {
  const dispatch = useDispatch();

  const isMarketSearchActive = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.isMarketSearchActive,
  );
  const selectedMarketId = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.selectedMarketId,
  );

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const isNavigatingRef = useRef(false); // pour distinguer d'une fermeture sèche ou suivie d'une navigation
  const flatListRef = useRef<RNFlatList>(null);
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
    console.log("onpress");
    // isMarketSheetActiveRef.current = true;
    // reconstruction d'un objet de type ShopResultData
    const transformedShops: ShopResultData[] = shops.map((shop, index) => {
      const { matchedStocks, ...cleanShop } = shop;
      return {
        shop: cleanShop,
        relevantProducts: shop.matchedStocks ?? [],
        distance: 0,
      };
    });

    // dispatch(setShopResultsList(transformedShops))
    isNavigatingRef.current = true;

    await SheetManager.hide("map-market-results", {
      payload: {
        confirmed: true,
        resultsList: transformedShops,
      },
    });

    // await handleSheetFlow({
    //   sheet: "map-shop-results",
    //   closeBefore: "map-market-results",
    //   payload: {
    //     resultsList: transformedShops,
    //     navigation,
    //     mapSearchBoxRef,
    //     onBackFn: () => {
    //       handleSheetFlow({
    //         sheet: "map-market-results",
    //         closeBefore: "map-shop-results",
    //         payload: {
    //           resultsList: markets,
    //           navigation,
    //           mapSearchBoxRef,
    //         },
    //       });
    //     },
    //   },
    // });
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
        dispatch(setIsMarketSearchActive(false));
        if (!isNavigatingRef.current) {
          console.log(
            "------------------------------------------------------------------------- sheet market : fermeture sèche",
          );
          // if (isMarketSheetActiveRef.current === false) {
          dispatch(clearMarketResultsList());
          dispatch(clearShopResultsList());
          props.payload?.mapSearchBoxRef.current?.openSearch();
          // }
        } else {
          console.log(
            "------------------------------------------------------------------------- sheet market : navigation",
          );
          isNavigatingRef.current = false;
        }
      }}
      onOpen={() => {
        if (!isMarketSearchActive) dispatch(setIsMarketSearchActive(true));
      }}
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
