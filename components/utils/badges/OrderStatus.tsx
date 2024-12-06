import React from "react";
import { Text, View } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody2 from "../texts/Body2";

type OrderStatusBadgeProps = {
  status: "pending" | "validated" | "withdrawn" | "canceled";
  extraClasses?: string;
};

export default function OrderStatusBadge(
  props: OrderStatusBadgeProps,
): JSX.Element {
  const backgroundColor = () => {
    switch (true) {
      case props.status === "pending":
        return "bg-warning";
      case props.status === "validated":
        return "bg-secondary";
      case props.status === "withdrawn":
        return "bg-primary";
      case props.status === "canceled":
        return "bg-danger";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg py-1 px-2 ${backgroundColor()}`}
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
