import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mapShopResultsState,
  setSelectedShopId,
} from "../../reducers/mapShopResults";
import { closeIfOpen } from "../../helpers/sheetHelpers";

import { ShopResultData } from "../../types/API";
import { Animated, FlatList, View } from "react-native";

import ActionSheet, {
  SheetManager,
  SheetProps,
  ScrollView,
  getSheetStack,
  ActionSheetRef,
} from "react-native-actions-sheet";
import TextHeading4 from "../utils/texts/Heading4";
import BackLabelButton from "../utils/buttons/BackLabel";
import ShopSearchResultCard from "../cards/ShopSearchResult";
import { withSpring } from "react-native-reanimated";

export default function MapShopResults(props: SheetProps<"map-shop-results">) {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const shops: ShopResultData[] = props.payload?.resultsList ?? [];

  const dispatch = useDispatch();
  const selectedShopId = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.selectedShopId,
  );
  const flatListRef = useRef<FlatList>(null);

  const [snapIndex, setSnapIndex] = useState(0);

  const getFlatListHeight = () => {
    switch (snapIndex) {
      case 0:
        return "30%"; // 25%
      case 1:
        return "40%"; // 50%
      case 2:
        return "100%"; // 100%
      default:
        return "40%";
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
      console.log("isOpen :", actionSheetRef.current?.isOpen());
      console.log("flatlist ref :", flatListRef);

      const index = props.payload?.resultsList.findIndex(
        (result) => result.shop?._id === selectedShopId,
      );

      console.log("index :", index);

      if (index !== -1) {
        console.log("youpi", index);
        flatListRef.current?.scrollToIndex({
          index: Number(index),
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedShopId]);

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
      id={props.sheetId}
      ref={actionSheetRef}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        <View className="px-3 w-full">
          {props.payload?.onBackFn && (
            <BackLabelButton
              backLabel="Retour aux points de vente"
              onPressFn={props.payload.onBackFn}
            />
          )}
          <TextHeading4 centered extraClasses="my-3 h-10">
            {`${props.payload?.resultsList.length.toString()} Producteur(s)`}
          </TextHeading4>
        </View>

        <View className={`h-[${getFlatListHeight()}]`}>
          <FlatList
            data={shops}
            keyExtractor={(item) => item.shop!._id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            // style={{ flex: 0.3, width: "100%" }}
            style={{ height: getFlatListHeight(), width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            ListFooterComponent={<View style={{ height: 30 }} />}
            ref={flatListRef}
            renderItem={({ item }) => (
              <ShopSearchResultCard
                shopData={item.shop}
                results={item.relevantProducts.length}
                distance={item.distance}
                onPressFn={() => {
                  const sheetId = getSheetStack()[0].id;
                  closeIfOpen(sheetId);
                  props.payload?.navigation.navigate("ShopUser", {
                    shopId: item.shop!._id,
                    distance: item.distance,
                    relevantProducts: item.relevantProducts,
                    sheetId,
                  });
                }}
                isHighlighted={item.shop?._id === selectedShopId}
                extraClasses="mb-1"
                displayMode="bottomSheet"
              />
            )}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
