import React from "react";
import { MarketData } from "../../types/API";
import SwitchInput from "../utils/inputs/Switch";

import { View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody2 from "../utils/texts/Body2";
import TextBody1 from "../utils/texts/Body1";
import BadgeGrey from "../utils/badges/Grey";

type MarketSelectorProps = {
  market: MarketData;
  value: boolean;
  onSwitchChange: (isEnabled: boolean) => void;
  extraClasses?: string;
};

export default function MarketSelector(
  props: MarketSelectorProps,
): JSX.Element {
  return (
    <View className={`${props.extraClasses} flex flex-row`}>
      <View className="w-[80%]">
        <BadgeGrey extraClasses="mb-2 mx-5">{props.market.name}</BadgeGrey>
        <TextBody2 extraClasses="px-5">
          {props.market.address.address1}
        </TextBody2>
        {props.market.address.address2 && (
          <TextBody2 extraClasses="px-5">
            {props.market.address.address2}
          </TextBody2>
        )}
        <View className="flex flex-row">
          <TextBody1 extraClasses="px-5">
            {props.market.address.postalCode}
          </TextBody1>
          <TextBody1>{props.market.address.city}</TextBody1>
        </View>
      </View>
      <View className="flex flex-row items-start w-[20%]">
        <SwitchInput
          thumbColor="#215487"
          label=""
          value={props.value}
          extraClasses=""
          onValueChange={props.onSwitchChange}
        />
      </View>
    </View>
  );
}
