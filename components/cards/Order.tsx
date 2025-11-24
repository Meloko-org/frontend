import React, { JSX, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import TextHeading4 from "../utils/texts/Heading4";
import globalTools from "../../modules/globalTools";
import orderTools from "../../modules/orderTools";
import { OrderData } from "../../types/API";
import BadgeSecondary from "../utils/badges/Secondary";
import BadgeWithdrawStatus from "../utils/badges/WithdrawStatus";
import TextBody2 from "../utils/texts/Body2";
import { BadgeWithdrawStatusProps } from "../utils/badges/WithdrawStatus";

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
        className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 w-full dark:bg-tertiary`}
      >
        <View className="mb-2">
          <TextHeading4>{`Commande n° ${props.orderData.invoiceNumber}`}</TextHeading4>
        </View>

        <View className="flex flex-row items-center gap-x-2">
          <View className="flex-grow">
            <View>
              <TextBody2 extraClasses="ml-2 mb-1">
                {globalTools.formatDateToFr(props.orderData.createdAt)}
              </TextBody2>
            </View>
            <View className="self-start">
              <BadgeSecondary extraClasses="">{`${nbProducts()} produit${nbProducts() > 1 ? "s" : ""} chez ${props.orderData.details.length} producteur${props.orderData.details.length > 1 ? "s" : ""}`}</BadgeSecondary>
            </View>
          </View>
          <View className="w-auto">
            <BadgeWithdrawStatus
              type={status as BadgeWithdrawStatusProps["type"]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
