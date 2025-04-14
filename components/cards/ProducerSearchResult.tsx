import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import IconButton from "../utils/buttons/Icon";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import { ShopData } from "../../types/API";

type CardProducerSearchResultProps = {
  shopData: ShopData;
  withdrawData?: object[];
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
  displayMode?: "bottomSheet" | "mapCallout" | "order";
  showDirectionButton?: boolean;
};

export default function CardProducerSearchResult(
  props: CardProducerSearchResultProps,
): JSX.Element {
  console.log("mode :", props.displayMode);
  console.log("shopData :", props.shopData);
  // console.log("withdrawData :", props.withdrawData.length)
  // console.log("relevants: ", props.shopData.searchData.relevantProducts.length)

  return (
    <TouchableOpacity onPress={props.onPressFn}>
      <View
        className={`${props.extraClasses} ${props.displayMode === "bottomSheet" || props.displayMode === "order" ? "rounded-lg shadow-sm bg-white p-2 dark:bg-tertiary" : "p-2"} flex flex-row w-full`}
      >
        <View className="flex flex-row items-center w-4/5">
          {props.displayMode !== "order" && (
            <View className="flex flex-row items-center rounded-sm w-24 h-full">
              <Image
                source={
                  props.shopData?.logo
                    ? { uri: props.shopData.logo }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                alt={`logo de la boutique ${props.shopData?.name}`}
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>
          )}

          <View className="h-full pl-2 items-start">
            <View className="flex flex-row items-center">
              <Text className="text-lg font-bold text-darkbg dark:text-lightbg">
                {props.shopData?.name}
              </Text>
              {props.shopData?.searchData &&
                props.shopData.searchData.distance && (
                  <Text className="text-xs text-darkbg dark:text-lightbg">
                    {" "}
                    - {props.shopData.searchData.distance.toFixed(2)} km
                  </Text>
                )}
            </View>
            <StarsNotation
              iconNames={["star", "star-half", "star-o"]}
              shopData={props.shopData}
              extraClasses="pb-1"
            />
            {props.shopData?.searchData &&
              props.shopData.searchData.relevantProducts && (
                <BadgeSecondary extraClasses="px-2">{`${props.shopData.searchData.relevantProducts.length} produit que vous recherchez`}</BadgeSecondary>
              )}
            {props.displayMode === "order" && (
              <BadgeSecondary extraClasses="px-2">{`${props.withdrawData?.length} produit${props.withdrawData?.length && props.withdrawData?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
            )}
            {props.displayMode === "mapCallout" ||
              (props.displayMode === "bottomSheet" && (
                <BadgeSecondary extraClasses="px-1">{`${props.shopData?.stocks?.length} produit${props.shopData?.stocks?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
              ))}
          </View>
        </View>
        {props.showDirectionButton && (
          <View className="flex flex-row justify-center items-center w-1/5">
            <IconButton
              iconName="location-arrow"
              onPressFn={() => console.log("open google map")}
              extraClasses="w-[50px] h-[50px] bg-success"
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
