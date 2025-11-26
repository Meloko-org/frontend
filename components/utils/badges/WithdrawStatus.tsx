import React, { JSX } from "react";
import { Text, View } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody2 from "../texts/Body2";

export type BadgeWithdrawStatusProps = {
  type:
    | "pending"
    | "partialValidated"
    | "validated"
    | "partialWithdrawn"
    | "withdrawn"
    | "canceled"
    | "partialCanceled";
  extraClasses?: string;
};

export default function BadgeWithdraw(
  props: BadgeWithdrawStatusProps,
): JSX.Element {
  const backgroundColor = () => {
    switch (true) {
      case props.type === "pending":
        return "bg-pending";
      case props.type === "partialValidated":
        return "bg-partialValidated";
      case props.type === "validated":
        return "bg-validated";
      case props.type === "partialWithdrawn":
        return "bg-partialWithdrawn";
      case props.type === "withdrawn":
        return "bg-withdrawn";
      case props.type === "partialCanceled":
        return "bg-partialCanceled";
      case props.type === "canceled":
        return "bg-canceled";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg py-1 px-2 ${backgroundColor()}`}
    >
      <TextBody2 extraClasses="text-lightbg font-bold uppercase">
        {props.type === "pending" && `attende de\nvalidation`}
        {props.type === "partialValidated" && `validation\npartielle`}
        {props.type === "validated" && `à retirer`}
        {props.type === "partialWithdrawn" && `retrait\npartiel`}
        {props.type === "withdrawn" && `retirée`}
        {props.type === "canceled" && `annulée`}
        {props.type === "partialCanceled" && `annulation\npartielle`}
      </TextBody2>
    </View>
  );
}
