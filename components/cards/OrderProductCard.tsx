import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody2 from "../utils/texts/Body2";
import { OrderData } from "../../types/API";

type OrderProductCardProps = {
  orderProductData?: OrderData["details"][0]["products"][0];
  onPressFn?: (id: string) => void;
  extraClasses?: string;
  showImage?: boolean;
  status?: string;
};

export default function OrderProductCard({
  orderProductData,
  onPressFn,
  extraClasses,
  showImage,
  status,
}: OrderProductCardProps): JSX.Element {
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  useEffect(() => {
    if (status === "validated" || status === "withdrawn") {
      if (orderProductData?.isConfirmed === false) {
        setIsCanceled(true);
      }
    }
    if (status === "canceled") {
      setIsCanceled(true);
    }
  }, [status]);

  const toggleCancel = () => {
    setIsCanceled((prev) => !prev);
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "gr") {
      if (quantity < 1000) {
        return `${quantity} gr`;
      } else {
        return `${(quantity / 1000).toFixed(1)} kg`;
      }
    }
    return `${quantity}`;
  };

  const getPrice = (price: number, quantity: number, unit: string) => {
    return unit === "gr"
      ? ((quantity / 1000) * price).toFixed(2)
      : (quantity * price).toFixed(2);
  };

  const tags =
    orderProductData?.product.tags &&
    orderProductData?.product.tags.map((tag) => {
      // console.log("s", s)
      return (
        <BadgeSecondary
          key={tag._id}
          extraClasses="mb-1 mr-1 px-1"
        >{`${tag.name}`}</BadgeSecondary>
      );
    });

  const unit =
    orderProductData?.product.product.weight.unit === "gr" ? "kg" : "pièce";

  console.log(
    "      -->  props orderProductData: ",
    JSON.stringify(orderProductData, null, 2),
  );

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPressFn && status === "pending") {
          onPressFn(orderProductData?.product._id);
          toggleCancel();
        }
      }}
    >
      <View className={`${extraClasses} relative`}>
        <View className="rounded-lg border shadow-sm bg-white p-2 dark:bg-tertiary w-full">
          <View className="flex flex-row items-center w-full">
            <View className="flex flex-row items-center rounded-lg w-1/5">
              <Image
                source={
                  orderProductData?.product.product.image
                    ? {
                        uri: orderProductData?.product.product.image,
                      }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg w-20 h-20"
                alt={`Illustration du produit ${orderProductData?.product.product.name}`}
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>

            <View className="w-4/5 px-5 items-start">
              <View className="">
                <TextHeading4
                  centered
                  extraClasses="mb-1"
                >{`${orderProductData?.product.product.family.name + " " + orderProductData?.product.product.name}`}</TextHeading4>
              </View>
              <View className="flex flex-row">
                <PricePer extraClasses="h-7 mr-2">{`${orderProductData?.product.price.$numberDecimal + " € / " + unit}`}</PricePer>
                <View className="flex-row flex-wrap">{tags}</View>
              </View>
              <View className="flex flex-row w-full justify-between mt-2">
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Quantité : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {formatQuantity(
                        orderProductData?.quantity,
                        orderProductData?.product.product.weight.unit,
                      )}
                    </TextBody1>
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Prix : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {getPrice(
                        orderProductData?.product.price.$numberDecimal,
                        orderProductData?.quantity,
                        orderProductData?.product.product.weight.unit,
                      )}{" "}
                      €
                    </TextBody1>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {isCanceled && (
          <View className="absolute w-full h-full inset-0">
            <View className="absolute inset-0 opacity-70 w-full h-full bg-black rounded-lg" />
            {status !== "canceled" && (
              <View className="absolute inset-0 flex items-center justify-center h-full w-full">
                <Text className="text-danger font-bold text-lg rounded-lg bg-lightbg p-1">
                  Produit annulé
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
