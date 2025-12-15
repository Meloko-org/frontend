import React, { JSX } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  CartState,
} from "../../reducers/cart";
import { LightShopData, ShopData, StockData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import PriceBadge from "../utils/badges/Price";
import IconButton from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import { useColorScheme } from "nativewind";
import orderTools from "../../modules/orderTools";
import { SheetManager } from "react-native-actions-sheet";
import CartControlButton from "../utils/buttons/CartControlButton";
import { getProductTotal } from "../../modules/CartTools";
import { formatCentsToEuros } from "../../modules/globalTools";

type CardProductProps = {
  stockData?: StockData;
  shopData: LightShopData;
  quantity?: number;
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
  displayMode: "cart" | "shop" | "withdraw" | "validation" | "detail";
  quantityControllable?: boolean;
  showImage?: boolean;
};

export default function CardProduct({
  stockData,
  shopData,
  quantity,
  onPressFn,
  extraClasses,
  displayMode,
  quantityControllable,
  showImage,
}: CardProductProps): JSX.Element {
  console.log("----- PRODUCT CARD -----");
  // console.log("is stockData :", stockData !== undefined);
  // console.log(" is shopData :", shopData !== undefined);

  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const { colorScheme } = useColorScheme();

  const showProductDetailsBottomSheet = () => {
    SheetManager.show("product-details", {
      payload: {
        stockData: stockData,
        shopData: shopData,
        unit: unitLabel,
      },
    });
  };

  const isBulk = !!stockData?.product.family.productsTypes.includes("bulk");

  const productName = !isBulk
    ? stockData?.productCustomName
    : stockData?.product.family.name + " " + stockData?.product.name;

  const productImage = !isBulk ? stockData?.image : stockData?.product.image;

  const isWeightProduct = stockData?.product.weight.unit === "gr";
  const unitLabel = isWeightProduct ? "kg" : "la pièce";

  // console.log("PRODUCTCARD cart :", JSON.stringify(cartStore, null, 2))

  return (
    <>
      <TouchableOpacity
        onPress={showProductDetailsBottomSheet}
        activeOpacity={0.8}
        style={{ shadowColor: "#000" }}
        className={`${extraClasses} rounded-lg shadow-md bg-white px-2 py-1 dark:bg-tertiary flex flex-row`}
      >
        <View className="flex flex-row items-center w-full">
          <View className="flex flex-row w-4/5 items-center">
            {showImage && (
              <View className="flex flex-row items-center rounded-sm w-auto h-full">
                <Image
                  source={
                    productImage
                      ? { uri: productImage }
                      : require("../../assets/icon.png")
                  }
                  className={`rounded-lg ${displayMode === "detail" ? "w-12 h-12" : "w-20 h-20"}`}
                  alt={`Illustration du produit ${stockData?.product.name}`}
                  resizeMode="cover"
                  width={72}
                  height={48}
                />
              </View>
            )}

            <View
              className={`${
                showImage ? "w-3/5" : "w-4/5"
              } h-full px-2 items-start`}
            >
              <TextBody1 extraClasses="mb-1">{productName}</TextBody1>

              {displayMode === "detail" || displayMode === "cart" ? (
                <PriceBadge
                  colour="bg-secondary"
                  extraClasses="px-2 py-1"
                  textClasses="font-bold"
                >
                  {stockData && quantity
                    ? formatCentsToEuros(getProductTotal(stockData, quantity))
                    : "0.00"}
                </PriceBadge>
              ) : (
                <PricePer>{`${formatCentsToEuros(stockData!.price)} / ${unitLabel}`}</PricePer>
              )}
            </View>
          </View>

          {displayMode !== "withdraw" && displayMode !== "detail" && (
            <View className="w-1/5 flex flex-column justify-center items-center">
              <CartControlButton
                stockData={stockData!}
                shopData={shopData}
                quantityControllable={quantityControllable}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
}
