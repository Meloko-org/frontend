import React, { JSX } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import IconButton from "../utils/buttons/Icon";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import { ShopData, ShopResultData } from "../../types/API";

type ShopSearchResultCardProps = {
  shopData: ShopData;
  results?: number;
  distance?: number;
  withdrawData?: object[];
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
  displayMode?: "bottomSheet" | "mapCallout" | "order";
  isHighlighted: boolean;
  showDirectionButton?: boolean;
};

export default function ShopSearchResultCard({
  shopData,
  results,
  distance,
  withdrawData,
  onPressFn,
  extraClasses,
  displayMode,
  isHighlighted,
  showDirectionButton,
}: ShopSearchResultCardProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPressFn}>
      <View
        className={`${extraClasses} ${displayMode === "bottomSheet" || displayMode === "order" ? "rounded-lg shadow-sm p-1" : "p-2"} ${isHighlighted ? "bg-primary/50" : " bg-white p-2 dark:bg-tertiary"} flex flex-row w-full`}
      >
        <View className="flex flex-row items-center w-4/5">
          {displayMode !== "order" && (
            <View className="flex flex-row items-center rounded-sm w-24 h-full">
              <Image
                source={
                  shopData?.logo
                    ? { uri: shopData.logo }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>
          )}

          <View className="h-full pl-2 items-start">
            <View className="flex flex-row items-center">
              <View className="grow">
                <Text className="text-lg font-bold text-darkbg dark:text-lightbg">
                  {shopData?.name}
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
            <StarsNotation
              iconNames={["star", "star-half", "star-o"]}
              shopData={shopData}
              extraClasses="pb-1"
            />
            {results && (
              <BadgeSecondary extraClasses="px-1 mb-1">{`${results} produit${results > 1 ? "s" : ""} que vous recherchez`}</BadgeSecondary>
            )}
            {displayMode === "order" && withdrawData && (
              <BadgeSecondary extraClasses="px-2">{`${withdrawData?.length} produit${withdrawData?.length && withdrawData?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
            )}
            {(displayMode === "mapCallout" ||
              displayMode === "bottomSheet") && (
              <BadgeSecondary extraClasses="px-1">{`${shopData?.stocks?.length} produit${shopData?.stocks?.length > 1 ? "s" : ""} chez ce producteur`}</BadgeSecondary>
            )}
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
