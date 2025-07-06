import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import ActionSheet, {
  SheetProps,
  ScrollView,
} from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading2 from "../utils/texts/Heading2";
import PricePer from "../utils/badges/Dark";
import CartControlButton from "../utils/buttons/CartControlButton";
import TextBody1 from "../utils/texts/Body1";
import TagBadge from "../utils/badges/Tag";
import TextHeading4 from "../utils/texts/Heading4";
import TextHeading3 from "../utils/texts/Heading3";

export default function ProductDetails(props: SheetProps<"product-details">) {
  const isBulk =
    props.payload?.stockData?.product.family.productsTypes.includes("bulk") ??
    false;

  const productName = !isBulk
    ? props.payload?.stockData?.productCustomName
    : props.payload?.stockData?.product.family.name +
      " " +
      props.payload?.stockData?.product.name;

  const productImage = !isBulk
    ? props.payload?.stockData?.image
    : props.payload?.stockData?.product.image;

  const tags = props.payload?.stockData?.tags.map((tag) => (
    <TagBadge key={tag.name} extraClasses="px-2 py-1 mr-1 mb-1">
      {tag.name}
    </TagBadge>
  ));

  console.log("PRODUCTDETAIL: stockdata :", props.payload?.stockData);

  return (
    <ActionSheet
      snapPoints={[100]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="px-3 pt-5 w-full h-full bg-lightbg dark:bg-darkbg">
        <View className="flex flex-row items-center">
          <View className="w-4/5">
            <TextHeading3>{productName}</TextHeading3>
          </View>

          <View className="w-1/5 flex flex-column justify-center items-center">
            <CartControlButton
              stockData={props.payload?.stockData!}
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
          className="pt-3"
        >
          <PricePer textClasses="text-lg font-bold">{`${props.payload?.stockData?.price.$numberDecimal} € / ${props.payload?.unit}`}</PricePer>

          <View className="flex flex-row items-center rounded-lg w-auto bg-white m-2">
            <Image
              source={
                productImage
                  ? { uri: productImage }
                  : require("../../assets/icon.png")
              }
              className="rounded-lg shadow-lg"
              alt={`Illustration du produit ${productName}`}
              resizeMode="cover"
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
              }}
            />
          </View>

          <View className="flex flex-row flex-wrap mb-3 justify-center">
            {tags}
          </View>

          <View className="px-3">
            <TextBody1 centered>
              {props.payload?.stockData?.description}
            </TextBody1>
          </View>

          {!isBulk && (
            <View className="px-3 my-5">
              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>Vendu par</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.weightPerUnit}
                  </TextHeading3>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>Prix au kilo</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.pricePerKilo.$numberDecimal} €
                  </TextHeading3>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>Origine</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.origin}
                  </TextHeading3>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>Portion</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.portion}
                  </TextHeading3>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>Format</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.format}
                  </TextHeading3>
                </View>
              </View>

              <View className="flex flex-row items-center justify-between rounded-lg bg-darkbg/10 px-2 mb-3">
                <View>
                  <TextHeading4>DLC</TextHeading4>
                </View>
                <View>
                  <TextHeading3>
                    {props.payload?.stockData?.bestBeforeDate}
                  </TextHeading3>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
