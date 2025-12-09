import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearShopResultsList,
  mapShopResultsState,
  setIsShopNavigating,
  setIsShopSearchActive,
  setSelectedShopId,
} from "../../reducers/mapShopResults";
import { closeIfOpen } from "../../helpers/sheetHelpers";

import { ShopResultData } from "../../types/API";
import { View, FlatList } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
  getSheetStack,
  ActionSheetRef,
  useSheetPayload,
} from "react-native-actions-sheet";

import TextHeading4 from "../utils/texts/Heading4";
import BackLabelButton from "../utils/buttons/BackLabel";
import ShopSearchResultCard from "../cards/ShopSearchResult";
import { withSpring } from "react-native-reanimated";
import { mapMarketResultsState } from "../../reducers/mapMarketResults";

/**
 * Impossible de faire fonctionner le scroll et le scrollToIndex en même temps:
 * FlatList de Actionsheet permet le scroll mais pas le scrollToIndex
 * FlatList de react-native permet le scrollToIndex mais pas le scroll
 * Idem dans MapMarketResults
 */

export default function MapShopResults(props: SheetProps<"map-shop-results">) {
  const dispatch = useDispatch();
  const selectedShopId = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.selectedShopId,
  );

  const isShopSearchActive = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isShopSearchActive,
  );

  const isMarketSearchActive = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.isMarketSearchActive,
  );

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const flatListRef = useRef<FlatList>(null);
  const isNavigatingRef = useRef(false); // pour distinguer d'une fermeture sèche ou suivie d'une navigation

  const shops: ShopResultData[] = props.payload?.resultsList ?? [];

  const [snapIndex, setSnapIndex] = useState(0);

  const getFlatListHeight = () => {
    switch (snapIndex) {
      case 0:
        return "35%"; // 25%
      case 1:
        return "50%"; // 50%
      case 2:
        return "100%"; // 100%
      default:
        return "35%";
    }
  };

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

  // on vide selectedShopId
  useEffect(() => {
    return () => {
      dispatch(setSelectedShopId(null));
    };
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      const index = props.payload?.resultsList.findIndex(
        (result) => result.shop?._id === selectedShopId,
      );

      if (index !== -1) {
        flatListRef.current?.scrollToIndex({
          index: Number(index),
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedShopId]);

  const onShopPress = async (item: ShopResultData) => {
    isNavigatingRef.current = true;
    const sheetId = getSheetStack()[0].id;

    await SheetManager.hide("map-shop-results", {
      payload: {
        confirmed: true,
        isGoingBack: false,
      },
    });

    props.payload?.navigation.navigate("ShopUser", {
      shopId: item.shop!._id,
      distance: item.distance,
      relevantProducts: item.relevantProducts,
      sheetId,
    });
  };

  const onBackFn = async () => {
    console.log("backButton press");
    isNavigatingRef.current = true;
    await SheetManager.hide("map-shop-results", {
      payload: {
        confirmed: true,
        isGoingBack: true,
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
          "sheet shop : onClose triggered (reason ?), isNavigatingRef:",
          isNavigatingRef,
        );
        dispatch(setIsShopSearchActive(false));
        // si fermeture sèche
        if (!isNavigatingRef.current) {
          console.log(
            "------------------------------------------------------------------------- sheet shop : fermeture sèche",
          );
          dispatch(setIsShopNavigating(false));
          dispatch(clearShopResultsList());
          if (!isMarketSearchActive) {
            props.payload?.mapSearchBoxRef.current?.openSearch();
          }
          // si suivie d'une navigation
        } else {
          console.log(
            "------------------------------------------------------------------------- sheet shop: navigation",
          );
          dispatch(setIsShopNavigating(true));
          isNavigatingRef.current = false;
        }
      }}
      onOpen={() => {
        if (!isShopSearchActive) dispatch(setIsShopSearchActive(true));
      }}
      id={props.sheetId}
      ref={actionSheetRef}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        {props.payload?.backButton && (
          <View className="px-3 mt-2">
            <BackLabelButton
              backLabel="Retour aux points de vente"
              onPressFn={onBackFn}
            />
          </View>
        )}

        <TextHeading4 centered extraClasses="my-3 h-10">
          {`${props.payload?.resultsList.length.toString()} Producteur(s)`}
        </TextHeading4>

        <View className={`h-[${getFlatListHeight()}]`}>
          <FlatList
            data={shops}
            keyExtractor={(item) => item.shop!._id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            style={{ height: getFlatListHeight(), width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            ListFooterComponent={<View style={{ height: 100 }} />}
            ref={flatListRef}
            renderItem={({ item }) => (
              <ShopSearchResultCard
                shopData={item.shop}
                results={item.relevantProducts.length}
                distance={item.distance}
                onPressFn={() => onShopPress(item)}
                isHighlighted={item.shop?._id === selectedShopId}
                extraClasses="mb-5"
                displayMode="bottomSheet"
              />
            )}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
