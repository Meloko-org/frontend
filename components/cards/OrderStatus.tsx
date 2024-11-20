import React from "react";
import { OrderData } from "../../types/API";
import { GestureResponderEvent, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody1 from "../utils/texts/Body1";

type OrderStatusProps = {
  orderData: OrderData;
  onPressFn: () => void;
  extraClasses?: string;
};

export default function OrderStatus(props: OrderStatusProps): JSX.Element {
  return (
    <TouchableOpacity onPress={() => props.onPressFn && props.onPressFn()}>
      <View className="flex flex-row justify-between items-center w-full">
        <View className="h-full items-start">
          <View>
            <TextHeading3>
              {props.orderData.user.lastname} {props.orderData.user.firstname}
            </TextHeading3>
          </View>
          <View className="flex flex-row w-full">
            <TextBody1>{props.orderData.createdAt}</TextBody1>
            <TextBody1> euros</TextBody1>
          </View>
        </View>
        <View></View>
      </View>
    </TouchableOpacity>
  );
}
