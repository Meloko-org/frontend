import React, { JSX } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import IconButton from "../utils/buttons/Icon";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import { MarketData, ShopData, ShopResultData } from "../../types/API";

type MarketSearchResultCardProps = {
  marketData: MarketData;
  results?: ShopData[];
  distance?: number;
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
  isHighlighted: boolean;
  showDirectionButton?: boolean;
};

export default function MarketSearchResultCard({
  marketData,
  results,
  distance,
  onPressFn,
  extraClasses,
  isHighlighted,
  showDirectionButton,
}: MarketSearchResultCardProps): JSX.Element {
  // console.log("highlighted :", isHighlighted);

  return (
    <TouchableOpacity onPress={onPressFn}>
      <View
        className={`${extraClasses} rounded-lg ${isHighlighted ? "bg-primary/50" : " bg-white dark:bg-tertiary"} p-1 flex flex-row w-full`}
      >
        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center rounded-sm w-1/4">
            <Image
              source={
                marketData?.image
                  ? { uri: marketData.image }
                  : require("../../assets/icon.png")
              }
              className="rounded-lg border border-primary w-24 h-24"
              alt={`photo du point de vente ${marketData?.name}`}
              resizeMode="cover"
              width={96}
              height={64}
            />
          </View>

          <View className="h-full pl-2 items-start pl-4 w-3/4">
            <View className="flex flex-row items-center w-full">
              <View className="grow">
                <Text className="text-lg font-bold text-darkbg dark:text-lightbg">
                  {marketData?.name}
                </Text>
              </View>
              <View className="mr-2">
                {distance && (
                  <Text className="text-xs text-darkbg dark:text-lightbg">
                    {`${distance.toFixed(2)} km`}
                  </Text>
                )}
              </View>
            </View>

            {results && (
              <BadgeSecondary extraClasses="px-2 mt-2">{`${results.length} producteur(s)\nsur ce point de vente`}</BadgeSecondary>
            )}
            {/* {displayMode === "order" && (
              <BadgeSecondary extraClasses="px-2">{`${withdrawData?.length} produit${withdrawData?.length && withdrawData?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
            )}
            {displayMode === "mapCallout" ||
              (displayMode === "bottomSheet" && (
                <BadgeSecondary extraClasses="px-1">{`${shopData?.stocks?.length} produit${shopData?.stocks?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
              ))} */}
          </View>
        </View>
        {showDirectionButton && (
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
