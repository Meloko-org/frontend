import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import PricePer from "../utils/badges/Dark";
import IconButton from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import TextHeading4 from "../utils/texts/Heading4";
import globalTools from "../../modules/globalTools";
import orderTools from "../../modules/orderTools";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
} from "../../reducers/cart";
import { OrderData } from "../../types/API";
import BadgeSecondary from "../utils/badges/Secondary";
import BadgeWithdrawStatus from "../utils/badges/WithdrawStatus";
import TextBody2 from "../utils/texts/Body2";
const FontAwesome = _Fontawesome as React.ElementType;
const formatDateTofr = require("../../modules/globalTools");
type CardOrderProps = {
  orderData: OrderData;
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
};

export default function CardOrder(props: CardOrderProps): JSX.Element {
  const [status, setStatus] = useState<string>("pending");

  const nbProducts = () => {
    let total = 0;
    props.orderData.details.forEach((d) => {
      total += d.products.length;
    });
    return total;
  };

  //définir le status
  useEffect(() => {
    const orderStatus = orderTools.getOrderStatus(props.orderData);
    console.log("orderStatus :", orderStatus);
    setStatus(orderStatus);
  }, []);

  return (
    <TouchableOpacity
      onPress={(value) => props.onPressFn && props.onPressFn(value)}
    >
      <View
        className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 flex flex-row w-full dark:bg-tertiary`}
      >
        <View className="flex flex-row justify-between items-center w-full">
          <View className={`h-full px-2 items-start`}>
            <TextHeading4>{`Commande n° ${props.orderData._id.slice(0, 7)}`}</TextHeading4>
            <TextBody2 extraClasses="mb-2">
              {globalTools.formatDateToFr(props.orderData.createdAt)}
            </TextBody2>
            <BadgeSecondary extraClasses="px-1">{`${nbProducts()} produit${nbProducts() > 1 ? "s" : ""} chez ${props.orderData.details.length} producteur${props.orderData.details.length > 1 ? "s" : ""}`}</BadgeSecondary>
          </View>
          <View className="pr-1 flex flex-row justify-start items-center h-full">
            <BadgeWithdrawStatus type={status} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
