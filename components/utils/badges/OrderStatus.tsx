import React, { JSX } from "react";
import { Text, View } from "react-native";
import TextBody2 from "../texts/Body2";
import { SubOrderStatus } from "../../../types/API";
import {
  getSubOrderStatusGroup,
  SUB_ORDER_GROUP_COLORS,
  SUB_ORDER_GROUP_LABELS,
} from "../../../helpers/orderHelpers";

type OrderStatusBadgeProps = {
  status: SubOrderStatus;
  extraClasses?: string;
};

export default function OrderStatusBadge({
  status,
  extraClasses,
}: OrderStatusBadgeProps): JSX.Element {
  const group = getSubOrderStatusGroup(status);
  const label = SUB_ORDER_GROUP_LABELS[group];
  const color = SUB_ORDER_GROUP_COLORS[group];

  return (
    <View
      className={`${extraClasses} flex flex-row justify-center items-center rounded-lg ${color}`}
    >
      <Text className="text-lightbg font-bold text-[12px] uppercase">
        {label}
      </Text>
    </View>
  );
}
