import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import { StockData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import ButtonIcon from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import TextHeading4 from "../utils/texts/Heading4";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  CartState,
} from "../../reducers/cart";
import { ProductData } from "../../types/API";
import PriceBadge from "../utils/badges/Price";
import TextBody2 from "../utils/texts/Body2";

const FontAwesome = _Fontawesome as React.ElementType;

type OrderProductCardProps = {
  orderProductData?: string;
  onPressFn?: () => void;
  extraClasses?: string;
  showImage?: boolean;
};

export default function OrderProductCard(
  props: OrderProductCardProps,
): JSX.Element {
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

  const getPrice = (price: number, quantity: number) => {
    return ((quantity / 1000) * price).toFixed(2);
  };

  /*const tags =
    props.stockData.tags &&
    props.stockData.tags.map((s) => {
      // console.log("s", s)
      return (
        <BadgeSecondary
          key={s._id}
          uppercase
          extraClasses="mt-1"
        >{`${s.name}`}</BadgeSecondary>
      );
    });*/
  // console.log(props.stockData)

  const unit =
    props.orderProductData?.product.product.weight.unit === "gr"
      ? "kg"
      : "la pièce";

  // console.log("cartStore: ", JSON.stringify(props.orderProductData, null, 2));
  // console.log("quantity :", props.orderProductData.quantity)
  // console.log("price :", props.orderProductData.product.price.$numberDecimal)

  return (
    <View
      className={`${props.extraClasses} rounded-lg border shadow-sm bg-white p-2 dark:bg-tertiary flex flex-row w-full`}
    >
      <View className="flex flex-row items-center w-full">
        <View className="flex flex-row items-center rounded-lg w-auto h-full">
          <Image
            source={
              props.orderProductData?.product.product.image
                ? { uri: props.orderProductData?.product.product.image }
                : require("../../assets/icon.png")
            }
            className="rounded-full w-20 h-20"
            alt={`Illustration du produit ${props.orderProductData?.product.product.name}`}
            resizeMode="cover"
            width={96}
            height={64}
          />
        </View>

        <View className="w-4/5 h-full px-2 items-start">
          <TextHeading4 extraClasses="mb-1">
            {`${props.orderProductData?.product.product.family.name} ${props.orderProductData?.product.product.name}`}
          </TextHeading4>
          <PricePer>{`${props.orderProductData?.product.price.$numberDecimal} € / ${unit}`}</PricePer>
          <View className="flex flex-row justify-between items-center w-full pr-3">
            <View className="flex flex-row items-center">
              <View>
                <TextBody2>Quantité : </TextBody2>
              </View>
              <View>
                <TextBody1>
                  {formatQuantity(
                    props.orderProductData?.quantity,
                    props.orderProductData?.product.product.weight.unit,
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
                  {getPrice(
                    props.orderProductData.product.price.$numberDecimal,
                    props.orderProductData.quantity,
                  )}{" "}
                  €
                </TextBody1>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
