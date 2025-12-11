import React, { JSX } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { GestureResponderEvent } from "react-native";
import { ProductCategoryCardData, ProductData } from "../../types/API";

type CardProductCategoryProps = {
  object: ProductCategoryCardData;
  extraClasses?: string;
  onPressFn: ((name: string) => void) | undefined;
};

export default function ProductCategory({
  object,
  onPressFn,
  extraClasses,
}: CardProductCategoryProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={() => onPressFn && onPressFn(object.category.name)}
      className={`${extraClasses && extraClasses} w-[150px] bg-white shadow-sm rounded-lg dark:bg-tertiary`}
    >
      <Image
        source={{ uri: object.category.image }}
        resizeMode="cover"
        className="w-full h-20 rounded-t-lg"
      />
      <View className="rounded-b-lg p-2">
        <Text className="text-base font-bold text-black dark:text-lightbg">
          {object.category.name}
        </Text>
        <Text className="text-xs uppercase dark:text-lightbg">
          {object.stocks?.length} produit
          {object.stocks!.length > 1 && "s"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
