import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PricePer from "../utils/badges/Dark";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";

const FontAwesome = _Fontawesome as React.ElementType;

export default function Product(): JSX.Element {
  return (
    <View className="flex flex-row w-full rounded-md p-2 shadow-xl bg-lightbg dark:bg-darkbg">
      <View className="flex-none w-24 justify-center rounded-lg h-auto">
        <Image
          source={require("../../assets/images/tomate.webp")}
          className="rounded-lg w-24 h-24"
          alt="fgsd"
          resizeMode="cover"
          width={100}
          height={50}
        />
      </View>
      <View className="shrink px-2">
        <Text className="font-bold text-wrap text-darkbg dar:text-lightbg">
          Nom du produit
        </Text>
        <Text className="text-wrap text-darkbg dar:text-lightbg mb-1">
          Lorem ipsum dolor sit amet, consectetur elit.
        </Text>
        <PricePer></PricePer>
      </View>
      <View className="flex-none w-12 justify-center">
        <TouchableOpacity className="bg-primary rounded-sm justify-center items-center w-12 h-16">
          <FontAwesome name="cart-plus" size={30} color="#FCFFF0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
