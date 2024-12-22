import React from "react";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { OrderData } from "../../types/API";
import { GestureResponderEvent, View } from "react-native";
import { useColorScheme } from "nativewind";

import globalTools from "../../modules/globalTools";

import { TouchableOpacity } from "react-native-gesture-handler";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody1 from "../utils/texts/Body1";
import OrderStatusBadge from "../utils/badges/OrderStatus";
import BadgeSecondary from "../utils/badges/Secondary";
import BlackBadge from "../utils/badges/Black";

type OrderStatusProps = {
  orderData: OrderData | undefined;
  status?: "pending" | "validated" | "withdrawn" | "canceled";
  onPressFn?: () => void;
  extraClasses?: string;
};

export default function OrderStatus(props: OrderStatusProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const shopDetails = props.orderData?.details.find(
    (detail) => detail?.shop === shopStore?._id,
  );

  // console.log("      --> ORDERSTATUS - subId : ", shopDetails._id);

  return (
    <TouchableOpacity onPress={() => props.onPressFn && props.onPressFn()}>
      <View
        className={`${props.extraClasses} rounded-lg border bg-white dark:bg-tertiary p-2`}
      >
        <View className="mb-1">
          <TextHeading4>
            {props.orderData?.user.lastname} {props.orderData?.user.firstname}
          </TextHeading4>
        </View>

        <View className="flex flex-row justify-between items-center w-full">
          <View className="h-full items-start w-4/6">
            <View className="flex flex-row w-full items-center justify-between mb-2">
              <View>
                <BlackBadge extraClasses="py-1 px-2">{`N°${props.orderData?._id.slice(0, 7)}`}</BlackBadge>
              </View>
              <View>
                <TextBody1 extraClasses="pr-3">
                  {globalTools.formatDateToFr(props.orderData.createdAt)}
                </TextBody1>
              </View>
            </View>
            <View className="flex flex-row justify-between w-full">
              <BadgeSecondary
                extraClasses="px-2"
                textClasses="font-bold"
              >{`${shopDetails?.shopTotalPrice.$numberDecimal} €`}</BadgeSecondary>
              <BadgeSecondary extraClasses="px-2 mr-3" textClasses="font-bold">
                {shopDetails?.withdrawMode}
              </BadgeSecondary>
            </View>
          </View>

          <View className="w-2/6">
            <OrderStatusBadge
              extraClasses="ml-2 py-1 px-1"
              // a revoir
              status={props.status ? props.status : shopDetails?.status}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
