import React from "react";
import { Text, View } from "react-native";
import TextHeading4 from "../texts/Heading4";
import TextBody2 from "../texts/Body2";
type BadgeWithdrawStatusProps = {
  type: "partial" | "none" | "full" | "canceled";
  extraClasses?: string;
};

export default function BadgeWithdraw(
  props: BadgeWithdrawStatusProps,
): JSX.Element {
  const backgroundColor = () => {
    switch (true) {
      case props.type === "partial":
        return "bg-warning";
      case props.type === "none":
        return "bg-gray-400";
      case props.type === "full":
        return "bg-primary";
      case props.type === "canceled":
        return "bg-danger";
    }
  };
  return (
    <View
      className={`${props.extraClasses} flex flex-row justify-center items-center rounded-lg py-1 px-2 ${backgroundColor()}`}
    >
      <TextBody2 extraClasses="text-lightbg font-bold uppercase">
        {props.type === "partial" && `retrait partiel`}

        {props.type === "canceled" && `annulée`}

        {props.type === "none" && `à retirer`}

        {props.type === "full" && `retirée`}
      </TextBody2>
    </View>
  );
}
