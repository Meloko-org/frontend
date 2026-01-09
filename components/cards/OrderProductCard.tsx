import React from "react";
import { OrderProduct, SubOrderStatus } from "../../types/API";
import { formatCentsToEuros } from "../../modules/globalTools";
import { getProductTotal } from "../../modules/CartTools";
import { useOrderProductOverlay } from "../../hooks/useOrderProductOverlay";

import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody2 from "../utils/texts/Body2";

type OrderProductCardProps = {
  product: OrderProduct;
  subOrderStatus: SubOrderStatus;
  stockIssue?: boolean;
  cancelledProducts: string[];
  notPickedUpProducts: string[];
  onToggleNotPickUp?: (productId: string) => void;
  onToggleCancel?: (productId: string) => void;
  onOpenSav?: (product: OrderProduct) => void;
  extraClasses?: string;
};

export default function OrderProductCard({
  product,
  subOrderStatus,
  stockIssue,
  cancelledProducts = [],
  notPickedUpProducts = [],
  onToggleNotPickUp,
  onToggleCancel,
  onOpenSav,
  extraClasses,
}: OrderProductCardProps) {
  if (!product) return;

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
    product?.product.tags &&
    product?.product.tags.length > 0 &&
    product?.product.tags.map((tag) => {
      return (
        <BadgeSecondary
          key={tag._id}
          extraClasses="mb-1 mr-1 px-1"
        >{`${tag.name}`}</BadgeSecondary>
      );
    });

  const productName = product?.product.productCustomName
    ? product.product.productCustomName
    : product?.product.product.family.name +
      " " +
      product?.product.product.name;

  const unit = product?.product.product.weight.unit === "gr" ? "kg" : "pièce";

  const { overlay, onPress, isInteractive } = useOrderProductOverlay({
    product,
    subOrderStatus,
    stockIssue,
    cancelledProducts,
    notPickedUpProducts,
    onToggleCancel,
    onToggleNotPickUp,
    onOpenSav,
  });

  // console.log("---------- ORDERPRODUCTCARD -------------")
  // console.log("product :", product)

  return (
    <TouchableOpacity
      disabled={!isInteractive}
      onPress={onPress}
      style={{ shadowColor: "#000" }}
      className={`${extraClasses} rounded-lg shadow-lg p-1 bg-white dark:bg-tertiary`}
    >
      <View className={`relative`}>
        <View className="">
          <View className="flex flex-row items-center">
            <View className="flex flex-row items-center rounded-lg w-1/5">
              <Image
                source={
                  product?.product.product.image
                    ? {
                        uri: product?.product.product.image,
                      }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg w-20 h-20"
                alt={`Illustration du produit ${product?.product.product.name}`}
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
                <PricePer extraClasses="h-7 mr-2">{`${formatCentsToEuros(product!.product.price) + "/" + unit}`}</PricePer>
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
                        product?.quantity!,
                        product?.product.product.weight.unit!,
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
                        getProductTotal(product!.product, product!.quantity),
                      )}
                    </TextBody1>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {overlay && (
          <View className="absolute w-full h-full inset-0">
            <View className="absolute inset-0 opacity-50 w-full h-full bg-black rounded-lg" />

            <View className="absolute inset-0 flex items-center justify-center px-4 h-full w-full">
              <Text
                className={`
                    font-bold text-lg text-center px-2 py-1 rounded-lg
                    ${
                      overlay.type === "error"
                        ? "bg-danger text-white"
                        : overlay.type === "warning"
                          ? "bg-warning text-white"
                          : overlay.type === "info"
                            ? "bg-lightbg text-black"
                            : ""
                    }
                  `}
              >
                {overlay.label}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
