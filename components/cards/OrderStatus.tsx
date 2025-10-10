import React, { JSX } from "react";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { OrderData } from "../../types/API";
import { useColorScheme } from "nativewind";

import globalTools from "../../modules/globalTools";

import { TouchableOpacity, View } from "react-native";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody1 from "../utils/texts/Body1";
import OrderStatusBadge from "../utils/badges/OrderStatus";
import BadgeSecondary from "../utils/badges/Secondary";
import BlackBadge from "../utils/badges/Black";
import TextBody2 from "../utils/texts/Body2";

type OrderStatusProps = {
  orderData: OrderData | undefined;
  status?: string | "pending" | "validated" | "withdrawn" | "canceled";
  onPressFn?: () => void;
  extraClasses?: string;
};

export default function OrderStatus({
  orderData,
  status,
  onPressFn,
  extraClasses,
}: OrderStatusProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const shopDetails = orderData?.details.find(
    (detail) => detail?.shop?.toString() === shopStore?._id.toString(),
  );

  // console.log("orderData :", JSON.stringify(orderData, null, 2));

  return (
    <TouchableOpacity onPress={() => onPressFn && onPressFn()}>
      <View
        className={`${extraClasses} rounded-lg border bg-white dark:bg-tertiary p-2`}
      >
        <View className="mb-1 bg-lightbg dark:bg-darkbg rounded-lg pb-1">
          <TextHeading4 centered>
            {orderData?.user.lastname} {orderData?.user.firstname}
          </TextHeading4>
        </View>

        <View className="flex flex-row items-center justify-between w-full mb-1">
          <View>
            <BlackBadge extraClasses="py-1 px-2">{`N°${orderData?._id.slice(0, 7)}`}</BlackBadge>
          </View>
          <View className="">
            <TextBody1 extraClasses="" textClasses="text-right">
              {globalTools.formatDateToFr(orderData?.createdAt)}
            </TextBody1>
          </View>
        </View>

        <View className="flex flex-row justify-between items-center w-full">
          <View className="h-full items-start w-4/6">
            <View>
              <BadgeSecondary extraClasses="px-2 mr-3" textClasses="font-bold">
                {shopDetails?.withdrawMode}
              </BadgeSecondary>
            </View>

            {shopDetails?.withdrawMode === "market" && (
              <View className="ml-2">
                <TextBody1>{shopDetails?.withdrawMarket}</TextBody1>
                <TextBody2>
                  {globalTools.getWeekDayLabel(
                    Number(shopDetails?.withdrawDay),
                  )}
                </TextBody2>
              </View>
            )}
          </View>

          <View className="w-2/6 justify-start items-end h-full">
            <View className="mb-3">
              <BadgeSecondary
                extraClasses="px-2"
                textClasses="font-bold"
              >{`${shopDetails?.shopTotalPrice} €`}</BadgeSecondary>
            </View>
            <OrderStatusBadge
              extraClasses="py-1 px-1"
              status={status ? status : shopDetails?.status}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
