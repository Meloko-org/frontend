import React, { JSX, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody2 from "../utils/texts/Body2";
import { OrderData } from "../../types/API";
import { formatCentsToEuros } from "../../modules/globalTools";
import { getProductTotal } from "../../modules/CartTools";

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
  // const [ isDeleted, setIsDeleted ] = useState<boolean>(false)

  useEffect(() => {
    if (status === "validated" || status === "withdrawn") {
      if (orderProductData?.isConfirmed === false) {
        setIsCanceled(true);
      }
    }
    if (status === "canceled") {
      setIsCanceled(true);
    }

    // if (orderProductData?.product.isDeleted) {
    //   setIsDeleted(true)
    // }
  }, [status]);

  // const isCanceled =
  //   status === "canceled" ||
  //   ((status === "validated" || status === "withdrawn") &&
  //     orderProductData?.isConfirmed === false);

  const isDeleted = !!orderProductData?.product.isDeleted;

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
    orderProductData?.product.tags.length > 0 &&
    orderProductData?.product.tags.map((tag) => {
      // console.log("s", s)
      return (
        <BadgeSecondary
          key={tag._id}
          extraClasses="mb-1 mr-1 px-1"
        >{`${tag.name}`}</BadgeSecondary>
      );
    });

  const productName = orderProductData?.product.productCustomName
    ? orderProductData.product.productCustomName
    : orderProductData?.product.product.family.name +
      " " +
      orderProductData?.product.product.name;

  const unit =
    orderProductData?.product.product.weight.unit === "gr" ? "kg" : "pièce";

  // console.log(
  //   "ORDERPRODUCTCARDS orderProductData: ",
  //   JSON.stringify(orderProductData, null, 2),
  // );

  console.log("ORDERPRODUCTCARD isDeleted :", isDeleted);

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPressFn && status === "pending") {
          onPressFn(orderProductData?.product._id!);
          toggleCancel();
        }
      }}
      style={{ shadowColor: "#000" }}
      className={`${extraClasses} rounded-lg shadow-lg p-1 bg-white dark:bg-tertiary`}
    >
      <View className={`relative`}>
        <View className="">
          <View className="flex flex-row items-center">
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
                <TextHeading4 centered extraClasses="mb-1">
                  {productName}
                </TextHeading4>
              </View>
              <View className="flex flex-row">
                <PricePer extraClasses="h-7 mr-2">{`${formatCentsToEuros(orderProductData!.product.price) + "/" + unit}`}</PricePer>
                <View className="flex-row flex-wrap flex-1">{tags}</View>
              </View>
              <View className="flex flex-row w-full justify-between mt-2">
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Quantité : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {formatQuantity(
                        orderProductData?.quantity!,
                        orderProductData?.product.product.weight.unit!,
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
                      {formatCentsToEuros(
                        getProductTotal(
                          orderProductData!.product,
                          orderProductData!.quantity,
                        ),
                      )}
                    </TextBody1>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {(isCanceled || isDeleted) && (
          <View className="absolute w-full h-full inset-0">
            <View className="absolute inset-0 opacity-70 w-full h-full bg-black rounded-lg" />
            {status !== "canceled" && (
              <View className="absolute inset-0 flex items-center justify-center h-full w-full">
                <View>
                  {isCanceled && (
                    <Text className="text-danger text-center font-bold text-lg rounded-lg bg-lightbg p-1">
                      Produit annulé
                    </Text>
                  )}
                  {isDeleted && (
                    <Text className="text-warning font-bold text-lg rounded-lg bg-lightbg p-1">
                      Ce produit n'est plus en vente
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
