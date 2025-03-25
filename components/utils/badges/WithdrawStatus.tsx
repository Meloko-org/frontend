import React from "react";
import { Text, View } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody2 from "../texts/Body2";

type BadgeWithdrawStatusProps = {
  type:
    | "pending"
    | "partialPending"
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
        return "bg-stone-800";
      case props.type === "partialPending":
        return "bg-stone-700";
      case props.type === "validated":
        return "bg-emerald-800";
      case props.type === "partialWithdrawn":
        return "bg-cyan-950";
      case props.type === "withdrawn":
        return "bg-success";
      case props.type === "partialCanceled":
        return "bg-warning";
      case props.type === "canceled":
        return "bg-danger";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg py-1 px-2 ${backgroundColor()}`}
    >
      <TextBody2 extraClasses="text-lightbg font-bold uppercase">
        {props.type === "pending" && `attende de\nvalidation`}
        {props.type === "partialPending" && `validation\npartielle`}
        {props.type === "validated" && `à retirer`}
        {props.type === "partialWithdrawn" && `retrait\npartiel`}
        {props.type === "withdrawn" && `retirée`}
        {props.type === "canceled" && `annulée`}
        {props.type === "partialCanceled" && `annulation\npartielle`}
      </TextBody2>
    </View>
  );
}
