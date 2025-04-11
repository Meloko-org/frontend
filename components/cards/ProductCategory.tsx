import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { GestureResponderEvent } from "react-native";
import { ProductData } from "../../types/API";

type CardProductCategoryProps = {
  category: {
    name: string;
    image: string;
    products: ProductData[];
  };
  extraClasses?: string;
  onPressFn: ((name: string) => void) | undefined;
};

export default function ProductCategory(
  props: CardProductCategoryProps,
): JSX.Element {
  return (
    <TouchableOpacity
      onPress={() => props.onPressFn && props.onPressFn(props.category.name)}
      className={`${props.extraClasses && props.extraClasses} w-[150px] bg-white shadow-sm rounded-lg dark:bg-tertiary`}
    >
      <Image
        source={{ uri: props.category.image }}
        resizeMode="cover"
        className="w-full h-20 rounded-t-lg"
      />
      <View className="rounded-b-lg p-2">
        <Text className="text-base font-bold dark:text-lightbg">
          {props.category.name}
        </Text>
        <Text className="text-xs uppercase dark:text-lightbg">
          {props.category.products.length} produit
          {props.category.products.length > 1 && "s"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
