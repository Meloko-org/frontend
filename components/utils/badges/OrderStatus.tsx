import React, { JSX } from "react";
import { View } from "react-native";
import TextBody2 from "../texts/Body2";

type OrderStatusBadgeProps = {
  status:
    | "pending"
    | "validated"
    | "withdrawn"
    | "canceled"
    | string
    | undefined;
  extraClasses?: string;
};

export default function OrderStatusBadge(
  props: OrderStatusBadgeProps,
): JSX.Element {
  const backgroundColor = () => {
    switch (true) {
      case props.status === "pending":
        return "bg-pending";
      case props.status === "validated":
        return "bg-validated";
      case props.status === "withdrawn":
        return "bg-withdrawn";
      case props.status === "canceled":
        return "bg-canceled";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg ${backgroundColor()}`}
    >
      <TextBody2 extraClasses="text-lightbg font-bold uppercase">
        {props.status === "pending" && `en attente`}

        {props.status === "validated" && `à retirer`}

        {props.status === "withdrawn" && `retirée`}

        {props.status === "canceled" && `annulée`}
      </TextBody2>
    </View>
  );
}
