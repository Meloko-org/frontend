import React, { JSX } from "react";
import { Text, View } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody2 from "../texts/Body2";
import { StatusData } from "../../../types/API";

export type BadgeWithdrawStatusProps = {
  type: StatusData;
  extraClasses?: string;
};

export default function BadgeWithdraw(
  props: BadgeWithdrawStatusProps,
): JSX.Element {
  const backgroundColor = () => {
    switch (true) {
      case props.type === "pending":
        return "bg-pending";
      case props.type === "partially-ready":
        return "bg-partialValidated";
      case props.type === "ready":
        return "bg-validated";
      case props.type === "completed":
        return "bg-partialWithdrawn";
      case props.type === "cancelled":
        return "bg-canceled";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg py-1 px-2 ${backgroundColor()}`}
    >
      <Text className="text-lightbg font-bold text-[12px] text-center uppercase">
        {props.type === "pending" && `En attende de\nvalidation`}
        {props.type === "partially-ready" && `Validation\npartielle`}
        {props.type === "ready" && `Prête à être\nretirée`}
        {props.type === "completed" && `Commande\nterminée`}
        {props.type === "cancelled" && `Commande\nannulée`}
      </Text>
    </View>
  );
}
