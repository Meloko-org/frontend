import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody2 from "../utils/texts/Body2";

const FontAwesome = _Fontawesome as React.ElementType;

type OrderProductCardProps = {
  orderProductData?: string;
  onPressFn?: (id: string) => void;
  extraClasses?: string;
  showImage?: boolean;
  status?: string;
};

export default function OrderProductCard(
  props: OrderProductCardProps,
): JSX.Element {
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  useEffect(() => {
    setIsCanceled(props.status === "canceled");
  }, [props.status]);

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

  const getPrice = (price: number, quantity: number) => {
    return ((quantity / 1000) * price).toFixed(2);
  };

  const tags =
    props.orderProductData?.product.tags &&
    props.orderProductData?.product.tags.map((tag) => {
      // console.log("s", s)
      return (
        <BadgeSecondary
          key={tag._id}
          uppercase
          extraClasses="mt-1"
        >{`${tag.name}`}</BadgeSecondary>
      );
    });

  const unit =
    props.orderProductData?.product.product.weight.unit === "gr"
      ? "kg"
      : "la pièce";

  console.log("      --> ORDERPRODUCTCARDS");
  console.log("      -->  canceled: ", isCanceled);
  console.log("      -->  props status: ", props.status);

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.onPressFn) {
          props.onPressFn(props.orderProductData?.product.product._id);
        }
        if (props.status !== "canceled") {
          toggleCancel();
        }
      }}
    >
      <View className={`${props.extraClasses} relative`}>
        <View className="rounded-lg border shadow-sm bg-white p-2 dark:bg-tertiary w-full">
          <View className="flex flex-row items-center w-full">
            <View className="flex flex-row items-center rounded-lg w-1/5">
              <Image
                source={
                  props.orderProductData?.product.product.image
                    ? { uri: props.orderProductData?.product.product.image }
                    : require("../../assets/icon.png")
                }
                className="rounded-full w-20 h-20"
                alt={`Illustration du produit ${props.orderProductData?.product.product.name}`}
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
                >{`${props.orderProductData?.product.product.family.name} ${props.orderProductData?.product.product.name}`}</TextHeading4>
              </View>
              <View className="flex flex-row">
                <PricePer>{`${props.orderProductData?.product.price.$numberDecimal} € / ${unit}`}</PricePer>
                {tags}
              </View>
              <View className="flex flex-row w-full justify-between mt-2">
                <View className="flex flex-row items-center">
                  <View>
                    <TextBody2>Quantité : </TextBody2>
                  </View>
                  <View>
                    <TextBody1>
                      {formatQuantity(
                        props.orderProductData?.quantity,
                        props.orderProductData?.product.product.weight.unit,
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
                        props.orderProductData.product.price.$numberDecimal,
                        props.orderProductData.quantity,
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
            {props.status !== "canceled" && (
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
