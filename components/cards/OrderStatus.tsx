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

type OrderStatusProps = {
  orderData: OrderData;
  onPressFn?: () => void;
  extraClasses?: string;
};

export default function OrderStatus(props: OrderStatusProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const shopDetails = props.orderData.details.find(
    (detail) => detail?.shop === shopStore?._id,
  );

  console.log("orderData :", props.orderData);
  console.log("shopId :", shopStore._id);
  console.log("details :", shopDetails);

  return (
    <TouchableOpacity onPress={() => props.onPressFn && props.onPressFn()}>
      <View
        className={`${props.extraClasses} rounded-lg border bg-white dark:bg-tertiary p-2`}
      >
        <View className="flex flex-row justify-between items-center w-full">
          <View className="h-full items-start">
            <View>
              <TextHeading4>{`commande n°${props.orderData._id.slice(0, 7)}`}</TextHeading4>
            </View>
            <View>
              <TextHeading4>
                {props.orderData.user.lastname} {props.orderData.user.firstname}
              </TextHeading4>
            </View>
            <View className="flex flex-row w-full">
              <View>
                <TextBody1>
                  {globalTools.formatDateToFr(props.orderData.createdAt)}
                </TextBody1>
              </View>
              <View>
                <TextBody1> euros</TextBody1>
              </View>
            </View>
          </View>
          <View>
            <OrderStatusBadge
              // a revoir
              status={shopDetails?.status}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
