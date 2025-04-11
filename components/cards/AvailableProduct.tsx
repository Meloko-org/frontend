import React, { useState } from "react";
import { ProductData } from "../../types/API";

import { View, Image, TouchableOpacity } from "react-native";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody1 from "../utils/texts/Body1";

type AvailableProductProps = {
  product: ProductData;
  extraClasses?: string;
  onHighlightProduct: (productId: string) => void;
};

export default function AvailableProduct(
  props: AvailableProductProps,
): JSX.Element {
  const [isHighlighted, sethighlighted] = useState<Boolean>(false);

  const handleHighlight = () => {
    sethighlighted(!isHighlighted);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleHighlight();
        props.onHighlightProduct(props.product._id);
      }}
    >
      <View
        className={`${props.extraClasses} ${isHighlighted ? "bg-primary" : "bg-white dark:bg-tertiary"} rounded-lg shadow-sm p-2 flex flex-row w-full`}
      >
        <View className="flex flex-row items-center w-full">
          <View className="flex flex-row items-center rounded-lg w-auto h-full">
            <Image
              source={
                props.product.image
                  ? { uri: props.product.image }
                  : require("../../assets/icon.png")
              }
              className="rounded-full w-20 h-20"
              alt={`Illustration du produit ${props.product.name}`}
              resizeMode="cover"
              width={96}
              height={64}
            />
          </View>

          <View className="w-4/5 h-full px-2 items-start">
            <TextBody1>{`${props.product.family.category.name} > ${props.product.family.name}`}</TextBody1>
            <TextHeading3>{props.product.name}</TextHeading3>
            {/* <View className="flex flex-row justify-start items-center">
            {tags}
          </View> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
