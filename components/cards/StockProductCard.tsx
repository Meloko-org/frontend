import React, { JSX, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { StockData, TagData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import TextBody2 from "../utils/texts/Body2";
import BlackBadge from "../utils/badges/Black";
import BadgeGrey from "../utils/badges/Grey";
import { formatCentsToEuros } from "../../modules/globalTools";

type StockProductCardProps = {
  stock: StockData;
  onPress?: () => void;
};

export default function StockProductCard({
  stock,
  onPress,
}: StockProductCardProps): JSX.Element {
  const tagBadges = stock.tags.map((tag: TagData) => {
    return (
      <BadgeGrey key={tag.name} extraClasses="mr-1 mb-1">
        {tag.name}
      </BadgeGrey>
    );
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ shadowColor: "#000" }}
      className={`${stock.stockTotal === 0 ? "bg-danger/80" : "bg-white dark:bg-tertiary"} shadow-lg rounded-lg  p-2 mb-2`}
    >
      <View className="flex flex-row items-center w-full">
        <View className="rounded-lg w-1/4">
          <Image
            source={
              stock.image
                ? { uri: stock.image }
                : stock.product.image
                  ? { uri: stock.product.image }
                  : require("../../assets/icon.png")
            }
            className="rounded-xl w-20 h-20 mr-3"
            alt={`Illustration du produit ${stock.productCustomName ? stock.productCustomName : stock.product.name}`}
            resizeMode="stretch"
            width={96}
            height={64}
          />
        </View>

        <View className="w-3/4 pl-2">
          <TextBody1 extraClasses="font-bold mb-1">
            {stock.productCustomName
              ? stock.productCustomName
              : stock?.product.family.name + " " + stock?.product.name}
          </TextBody1>

          <View className="flex flex-row">
            <View className="flex flex-row items-center">
              <TextBody2>Prix: </TextBody2>
              <TextBody1 extraClasses="font-bold">
                {formatCentsToEuros(stock.price)}
              </TextBody1>
              <TextBody2>
                {/* {stock.productCustomName !== undefined
                  ? " €"
                  : stock.product.weight.unit === "gr"
                    ? " € / kg"
                    : " € / pièce"} */}
                {stock.product.weight.unit === "gr" && " / kg"}
              </TextBody2>
            </View>

            <View className="flex flex-row flex-grow items-center justify-end pr-2">
              <TextBody2>Quantité: </TextBody2>
              <TextBody1 extraClasses="font-bold">{stock.stockTotal}</TextBody1>
            </View>
          </View>

          <View className="flex flex-row w-full flex-wrap mt-1">
            {tagBadges}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
