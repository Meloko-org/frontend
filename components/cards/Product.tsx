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
import { StockData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import PriceBadge from "../utils/badges/Price";
import IconButton from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import { useColorScheme } from "nativewind";
import orderTools from "../../modules/orderTools";
import { SheetManager } from "react-native-actions-sheet";
import CartControlButton from "../utils/buttons/CartControlButton";

type CardProductProps = {
  stockData?: StockData & {
    quantity: number;
  };
  onPressFn?: ((event: GestureResponderEvent) => void) | undefined;
  extraClasses?: string;
  displayMode: "cart" | "shop" | "withdraw" | "validation" | "detail";
  quantityControllable?: boolean;
  showImage?: boolean;
};

export default function CardProduct(props: CardProductProps): JSX.Element {
  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const { colorScheme } = useColorScheme();

  const showProductDetailsBottomSheet = () => {
    SheetManager.show("product-details", {
      payload: {
        stockData: props.stockData,
        unit: unit,
      },
    });
  };

  const unit =
    props.stockData?.product.weight.unit === "gr" ? "kg" : "la pièce";

  return (
    <>
      <TouchableOpacity
        onPress={showProductDetailsBottomSheet}
        activeOpacity={0.8}
        className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-tertiary flex flex-row w-full`}
      >
        <View className="flex flex-row items-center w-full">
          <View className="flex flex-row w-4/5">
            {props.showImage && (
              <View className="flex flex-row items-center rounded-lg w-auto h-full">
                <Image
                  source={
                    props.stockData?.product.image
                      ? {
                          uri: props.stockData.product.image,
                        }
                      : require("../../assets/icon.png")
                  }
                  className="rounded-full w-20 h-20"
                  alt={`Illustration du produit ${props.stockData?.product.name}`}
                  resizeMode="cover"
                  width={72}
                  height={48}
                />
              </View>
            )}

            <View
              className={`${
                props.showImage ? "w-3/5" : "w-4/5"
              } h-full px-2 items-start`}
            >
              <TextBody1 extraClasses="mb-1">{`${props.stockData?.product.family.name} ${props.stockData?.product.name}`}</TextBody1>

              {props.displayMode === "detail" ? (
                <PriceBadge
                  colour="bg-secondary"
                  extraClasses="px-2 py-1"
                  textClasses="font-bold"
                >
                  {props.stockData && props.stockData.quantity
                    ? orderTools
                        .getProductCost(
                          props.stockData?.price.$numberDecimal,
                          props.stockData?.quantity,
                          props.stockData?.product.weight.unit,
                        )
                        .toFixed(2)
                    : "null"}
                </PriceBadge>
              ) : (
                <PricePer>{`${props.stockData?.price.$numberDecimal} € / ${unit}`}</PricePer>
              )}
            </View>
          </View>

          <View className="w-1/5 flex flex-column justify-center items-center">
            <CartControlButton
              stockData={props.stockData}
              quantityControllable={props.quantityControllable}
            />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
