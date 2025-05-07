import React from "react";
import { MarketData, ShopData } from "../../types/API";
import { TouchableOpacity, View, Text } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import { Svg, Image as ImageSvg, Defs, ClipPath, Rect } from "react-native-svg";

type MarketMarkerCardProps = {
  marketData: MarketData;
  shops: ShopData[];
  distance: number;
  onPressFn?: () => void | undefined;
  extraClasses?: string;
};

export default function MarketMarkerCard({
  marketData,
  shops,
  distance,
  onPressFn,
  extraClasses,
}: MarketMarkerCardProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPressFn}>
      <View
        className={`${extraClasses} rounded-lg p-2 bg-lightbg dark:bg-darkbg`}
      >
        <View className="flex flex-row">
          <View className="w-auto">
            <Svg width={96} height={96}>
              <Defs>
                <ClipPath id="clip">
                  <Rect x="0" y="0" width="96" height="96" rx="8" ry="8" />
                </ClipPath>
              </Defs>
              <ImageSvg
                width={"100%"}
                height={"100%"}
                preserveAspectRatio="xMidYMid slice"
                href={
                  marketData?.image
                    ? { uri: marketData.image }
                    : require("../../assets/icon.png")
                }
                clipPath="url(#clip)"
              />
            </Svg>
          </View>
          <View className="w-auto" style={{ paddingLeft: 10 }}>
            <View className="flex flex-row w-full items-center">
              <Text className="text-lg font-bold text-darkbg dark:text-lightbg">
                {marketData?.name}
              </Text>
              {distance && (
                <Text className="text-xs text-darkbg dark:text-lightbg">
                  {" "}
                  - {distance.toFixed(2)} km
                </Text>
              )}
            </View>

            <BadgeSecondary extraClasses="px-1 text-wrap">
              {`${shops.length} produit${shops.length > 1 ? "s" : ""} chez ce producteur `}
            </BadgeSecondary>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
