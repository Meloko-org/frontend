import React from "react";
import { View, ScrollView, Image } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading2 from "../utils/texts/Heading2";
import PricePer from "../utils/badges/Dark";
import CartControlButton from "../utils/buttons/CartControlButton";

export default function ProductDetails(props: SheetProps<"product-details">) {
  return (
    <ActionSheet
      snapPoints={[90]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="px-3 pt-5 w-full h-full">
        <View className="flex flex-row items-center">
          <View className="w-4/5">
            <TextHeading2>
              {`${props.payload?.stockData?.product.family.name} ${props.payload?.stockData?.product.name}`}
            </TextHeading2>
          </View>

          <View className="w-1/5 flex flex-column justify-center items-center">
            <CartControlButton
              stockData={props.payload?.stockData}
              quantityControllable={true}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            width: "100%",
          }}
          className="py-3"
        >
          <PricePer>{`${props.payload?.stockData?.price.$numberDecimal} € / ${props.payload?.unit}`}</PricePer>

          <View className="flex flex-row items-center rounded-lg w-auto h-full bg-white m-2">
            <Image
              source={
                props.payload?.stockData?.product.image
                  ? {
                      uri: props.payload?.stockData.product.image,
                    }
                  : require("../../assets/icon.png")
              }
              className=""
              alt={`Illustration du produit ${props.payload?.stockData?.product.name}`}
              resizeMode="contain"
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
              }}
            />
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
