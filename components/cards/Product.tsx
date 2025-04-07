import React, { useRef, useState, useCallback } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  GestureResponderEvent,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
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
import TextHeading2 from "../utils/texts/Heading2";
import TextHeading3 from "../utils/texts/Heading3";
import { useColorScheme } from "nativewind";
import BadgeSecondary from "../utils/badges/Secondary";
import orderTools from "../../modules/orderTools";

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useColorScheme();

  const openSheet = () => {
    setModalVisible(true);
  };

  const closeSheet = () => {
    setModalVisible(false);
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "gr") {
      return quantity < 1000
        ? `${quantity} gr`
        : `${(quantity / 1000).toFixed(1)} kg`;
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
    <IconButton
      iconName="cart-plus"
      onPressFn={() => handleAddCartPress()}
      extraClasses="h-20 w-full bg-primary"
    />
  );

  const detailModal = () => {
    return (
      <Modal
        visible={isModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeSheet}
      >
        <View style={{ flex: 1 }}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["95%"]}
            index={0}
            enablePanDownToClose
            onClose={closeSheet}
            backgroundStyle={{
              backgroundColor: colorScheme === "dark" ? "#444C3D" : "#FFF",
            }}
          >
            <BottomSheetView>
              <View className="px-3 pt-5 w-full h-full">
                <View className="flex flex-row items-center">
                  <View className="w-4/5">
                    <TextHeading2>
                      {`${props.stockData?.product.family.name} ${props.stockData?.product.name}`}
                    </TextHeading2>
                  </View>

                  <View className="w-1/5 flex flex-column justify-center items-center">
                    {cartButton}
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
                  <PricePer>{`${props.stockData?.price.$numberDecimal} € / ${unit}`}</PricePer>

                  <View className="flex flex-row items-center rounded-lg w-auto h-full bg-white m-2">
                    <Image
                      source={
                        props.stockData?.product.image
                          ? {
                              uri: props.stockData.product.image,
                            }
                          : require("../../assets/icon.png")
                      }
                      className=""
                      alt={`Illustration du produit ${props.stockData?.product.name}`}
                      resizeMode="contain"
                      style={{
                        width: "100%",
                        aspectRatio: 16 / 9,
                      }}
                    />
                  </View>
                </ScrollView>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </Modal>
    );
  };

  const unit =
    props.stockData?.product.weight.unit === "gr" ? "kg" : "la pièce";

  return (
    <>
      {detailModal()}

      <TouchableOpacity
        onPress={openSheet}
        activeOpacity={0.8}
        className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-tertiary flex flex-row w-full`}
      >
        <View className="flex flex-row items-center w-full">
          <View className="flex flex-row w-4/5">
            {props.showImage && (
              <View className="flex flex-row items-center rounded-lg w-auto h-full">
                <Image
                  source={
                    props.stockData.product.image
                      ? {
                          uri: props.stockData.product.image,
                        }
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
              className={`${
                props.showImage ? "w-3/5" : "w-4/5"
              } h-full px-2 items-start`}
            >
              <TextBody1 extraClasses="mb-1">{`${props.stockData.product.family.name} ${props.stockData.product.name}`}</TextBody1>

              {props.displayMode === "detail" ? (
                <PriceBadge
                  colour="bg-secondary"
                  extraClasses="px-2 py-1"
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
            </View>
          </View>

          <View className="w-1/5 flex flex-column justify-center items-center">
            {cartButton}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
