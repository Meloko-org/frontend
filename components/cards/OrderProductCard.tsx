import React, { JSX, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody2 from "../utils/texts/Body2";
import { OrderData, OrderDataForShop, OrderProduct } from "../../types/API";
import { formatCentsToEuros } from "../../modules/globalTools";
import { getProductTotal } from "../../modules/CartTools";

type OrderProductCardProps = {
  orderProductData?: OrderProduct;
  productStatus: "confirmed" | "canceled" | "deleted";
  onPressFn?: (id: string) => void;
  extraClasses?: string;
  showImage?: boolean;
  status?: string;
};

export default function OrderProductCard({
  orderProductData,
  productStatus,
  onPressFn,
  extraClasses,
  showImage,
  status,
}: OrderProductCardProps) {
  if (!orderProductData) return;

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "gr") {
      if (quantity < 1000) {
        return `${quantity} gr`;
      } else {
        return `${(quantity / 1000).toFixed(1)} kg`;
      }
    }
    return `${quantity}`;
  };

  const tags =
    orderProductData?.product.tags &&
    orderProductData?.product.tags.length > 0 &&
    orderProductData?.product.tags.map((tag) => {
      return (
        <BadgeSecondary
          key={tag._id}
          extraClasses="mb-1 mr-1 px-1"
        >{`${tag.name}`}</BadgeSecondary>
      );
    });

  const productName = orderProductData?.product.productCustomName
    ? orderProductData.product.productCustomName
    : orderProductData?.product.product.family.name +
      " " +
      orderProductData?.product.product.name;

  const unit =
    orderProductData?.product.product.weight.unit === "gr" ? "kg" : "pièce";

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPressFn && status === "pending") {
          onPressFn(orderProductData?._id);
        }
      }}
      style={{ shadowColor: "#000" }}
      className={`${extraClasses} rounded-lg shadow-lg p-1 bg-white dark:bg-tertiary`}
    >
      <View className={`relative`}>
        <View className="">
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center rounded-lg w-1/5">
              <Image
                source={
                  orderProductData?.product.product.image
                    ? {
                        uri: orderProductData?.product.product.image,
                      }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg w-20 h-20"
                alt={`Illustration du produit ${orderProductData?.product.product.name}`}
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>

            <View className="w-4/5 px-5 items-start">
              <View className="">
                <TextHeading4 centered extraClasses="mb-1">
                  {productName}
                </TextHeading4>
              </View>
              <View className="flex flex-row">
                <PricePer extraClasses="h-7 mr-2">{`${formatCentsToEuros(orderProductData!.product.price) + "/" + unit}`}</PricePer>
                <View className="flex-row flex-wrap flex-1">{tags}</View>
              </View>
              <View className="flex flex-row w-full justify-between mt-2">
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Quantité : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {formatQuantity(
                        orderProductData?.quantity!,
                        orderProductData?.product.product.weight.unit!,
                      )}
                    </TextBody1>
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Prix : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {formatCentsToEuros(
                        getProductTotal(
                          orderProductData!.product,
                          orderProductData!.quantity,
                        ),
                      )}
                    </TextBody1>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {(productStatus === "canceled" || productStatus === "deleted") && (
          <View className="absolute w-full h-full inset-0">
            <View className="absolute inset-0 opacity-70 w-full h-full bg-black rounded-lg" />
            {status !== "canceled" && (
              <View className="absolute inset-0 flex items-center justify-center h-full w-full">
                <View>
                  {productStatus === "canceled" && (
                    <Text className="text-danger text-center font-bold text-lg rounded-lg bg-lightbg p-1">
                      Produit annulé
                    </Text>
                  )}
                  {productStatus === "deleted" && (
                    <Text className="text-warning font-bold text-lg rounded-lg bg-lightbg p-1">
                      Ce produit n'est plus en vente
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
