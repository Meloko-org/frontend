import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";
import { GestureResponderEvent } from "react-native";
import { StockData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import PriceBadge from "../utils/badges/Price";
import ButtonIcon from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import TextHeading4 from "../utils/texts/Heading4";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  CartState,
} from "../../reducers/cart";
import { ProductData } from "../../types/API";
import orderTools from "../../modules/orderTools";

const FontAwesome = _Fontawesome as React.ElementType;

type CardProductProps = {
  stockData?: StockData;
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

  const handleAddCartPress = async (): Promise<void> => {
    dispatch(
      addProductToCart({
        shop: props.stockData.shop,
        stockData: props.stockData,
        quantity: props.stockData.product.weight.unit === "gr" ? 100 : 1,
      }),
    );
  };

  const isInCart = () => {
    return (
      cartStore.find((c) => c.shop?._id === props.stockData.shop?._id) &&
      cartStore
        .find((c) => c.shop?._id == props.stockData.shop?._id)
        .products.find((p) => p.stockData._id === props.stockData._id)
    );
  };

  const cartButton = isInCart() ? (
    <>
      {props.quantityControllable && (
        <TouchableOpacity
          onPress={() => {
            dispatch(
              increaseCartQuantity({
                shopId: props.stockData.shop._id,
                stockId: props.stockData._id,
                increment:
                  props.stockData.product.weight.unit === "gr" ? 100 : 1,
              }),
            );
          }}
        >
          <Text className="text-3xl dark:text-lightbg">+</Text>
        </TouchableOpacity>
      )}
      <BadgeGrey extraClasses="px-2">
        {formatQuantity(
          cartStore
            .find((c) => c.shop._id == props.stockData.shop._id)
            .products.find((p) => p.stockData._id === props.stockData._id)
            .quantity || 0,
          props.stockData.product.weight.unit,
        )}
      </BadgeGrey>
      {props.quantityControllable && (
        <TouchableOpacity
          onPress={() => {
            dispatch(
              decreaseCartQuantity({
                shopId: props.stockData.shop._id,
                stockId: props.stockData._id,
                decrement:
                  props.stockData.product.weight.unit === "gr" ? 100 : 1,
              }),
            );
          }}
        >
          <Text className="text-3xl dark:text-lightbg">-</Text>
        </TouchableOpacity>
      )}
    </>
  ) : props.stockData.quantity ? (
    <BadgeGrey extraClasses="px-1">
      {formatQuantity(
        props.stockData.quantity,
        props.stockData.product.weight.unit,
      )}
    </BadgeGrey>
  ) : (
    <ButtonIcon
      iconName="cart-plus"
      onPressFn={() => handleAddCartPress()}
      extraClasses="h-20 w-full bg-primary"
    />
  );

  const tags =
    props.stockData.tags &&
    props.stockData.tags.map((s) => {
      // console.log("s", s)
      return (
        <BadgeSecondary
          key={s._id}
          uppercase
          extraClasses="mt-1 p-1 mr-1"
        >{`${s.name}`}</BadgeSecondary>
      );
    });
  // console.log(props.stockData)

  const unit =
    props.stockData?.product.weight.unit === "gr" ? "kg" : "la pièce";

  // console.log("cartStore: ", JSON.stringify(cartStore, null, 2));

  return (
    <View
      className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-tertiary flex flex-row w-full`}
    >
      <View className="flex flex-row items-center w-full">
        <View className="flex flex-row w-4/5">
          {props.showImage && (
            <View className="flex flex-row items-center rounded-lg w-auto h-full">
              <Image
                source={
                  props.stockData.product.image
                    ? { uri: props.stockData.product.image }
                    : require("../../assets/icon.png")
                }
                className="rounded-full w-20 h-20"
                alt={`Illustration du produit ${props.stockData.product.name}`}
                resizeMode="cover"
                width={72}
                height={48}
              />
            </View>
          )}

          <View
            className={`${props.showImage ? "w-3/5" : "w-4/5"} h-full px-2 items-start`}
          >
            <TextBody1 extraClasses="mb-1">{`${props.stockData.product.family.name} ${props.stockData.product.name}`}</TextBody1>
            {/* <PricePer>{`${props.stockData.price.$numberDecimal} € / ${props.stockData.product.weight.measurement.$numberDecimal}${props.stockData.product.weight.unit}`}</PricePer> */}

            {props.displayMode === "detail" ? (
              <PriceBadge
                colour="bg-white"
                extraClasses="px-2"
                textClasses="font-bold"
              >
                {orderTools
                  .getProductCost(
                    props.stockData?.price.$numberDecimal,
                    props.stockData?.quantity,
                    props.stockData?.product.weight.unit,
                  )
                  .toFixed(2)}
              </PriceBadge>
            ) : (
              <PricePer>{`${props.stockData?.price.$numberDecimal} € / ${unit}`}</PricePer>
            )}
            {/* <View className="flex flex-row justify-start items-center">
              {tags}
            </View> */}
          </View>
        </View>

        <View className="w-1/5 flex flex-column justify-center items-center">
          {cartButton}
        </View>
      </View>
    </View>
  );
}
