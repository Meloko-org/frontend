import React, { useState, useEffect } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  CartState,
} from "../../reducers/cart";
import CardProduct from "../../components/cards/Product";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import ButtonPrimaryStart from "../../components/utils/buttons/PrimaryStart";
import ButtonSecondaryStart from "../../components/utils/buttons/SecondaryStart";
import CartTools from "../../modules/CartTools";
import { mapShopResultsState } from "../../reducers/mapShopResults";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextBody2 from "../../components/utils/texts/Body2";
import TextBody1 from "../../components/utils/texts/Body1";

type CartRouteProp = RouteProp<UserTabParamList, "Cart">;

type CartNavProp = BottomTabNavigationProp<UserTabParamList, "Cart">;

type Props = {
  navigation: CartNavProp;
  route: CartRouteProp;
};

export default function CartScreen({ navigation }: Props) {
  /* ShopSearchStore */
  const isShopSearchActive = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isShopSearchActive,
  );

  const storedShopResults = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.resultsList,
  );

  const isShopNavigating = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isNavigating,
  );

  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const [cartTotal, setCartTotal] = useState<number | undefined>(0);

  useEffect(() => {
    if (cartStore.length > 0) {
      // let allShopsCost = CartTools.getTotalCost(cartStore);
      // setCartTotal(allShopsCost);

      const total = CartTools.getCartTotal(cartStore);
      setCartTotal(total);
    }
  }, [cartStore]);

  const products = cartStore.map((cart) => {
    const productsByShop = cart.products.map((p) => {
      return (
        <CardProduct
          stockData={p.stockData}
          shopData={cart.shop}
          key={p.stockData._id}
          extraClasses="mb-2"
          displayMode="cart"
          quantity={p.quantity}
          quantityControllable
          showImage
        />
      );
    });

    // let subTotal = 0;
    // const productsCost = cart.products.reduce((accumulator, currentValue) => {
    //   const quantity =
    //     currentValue.stockData.product.weight.unit === "gr"
    //       ? currentValue.quantity / 1000
    //       : currentValue.quantity;

    //   return quantity * Number(currentValue.stockData.price) + accumulator;
    // }, 0);
    // subTotal += productsCost / 100;

    const subTotal = CartTools.getShopSubtotal(cart);

    return (
      <View className="mb-5" key={cart.shop?._id}>
        <TextHeading4
          centered
          extraClasses="mb-2 pb-1 bg-night/20 dark:bg-night rounded-lg"
        >
          {cart.shop?.name}
        </TextHeading4>
        {productsByShop}
        <View className="flex flex-row justify-center items-center">
          <TextBody1 extraClasses="mr-5">Sous-total:</TextBody1>
          <TextHeading4>{subTotal.toFixed(2)} €</TextHeading4>
        </View>
      </View>
    );
  });

  const handleWithdrawModePress = () => {
    navigation.navigate("WithdrawModes", {
      from: "Cart",
      backLabel: "Retour au panier",
      screenTitle: "MODES DE RETRAIT",
    });
  };

  console.log("------------- CARTSCREEN ----------------------------");
  // console.log(
  //   "cartStore: ",
  //   JSON.stringify(
  //     cartStore.map((elt) => ({
  //       key: elt.shop?._id,
  //       shop: elt.shop,
  //       products: elt.products.map((pdt) => ({
  //         name: pdt.stockData.productCustomName
  //           ? pdt.stockData.productCustomName
  //           : pdt.stockData.product.name,
  //         quantity: pdt.quantity,
  //       })),
  //     })),
  //     null,
  //     2,
  //   ),
  // );

  // console.log("    SHOP:");
  // console.log("         shopSearchActive :", isShopSearchActive);
  // console.log("         results stored: ", storedShopResults.length);
  // console.log("         isNavigating: ", isShopNavigating);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3 flex flex-column h-full">
        {products.length > 0 ? (
          <>
            <TextHeading2 extraClasses="mb-5" centered>
              Mon panier
            </TextHeading2>
            <ScrollView>
              {products}
              <View className="px-3 bg-night rounded-lg my-5">
                <TextHeading3
                  centered
                  extraClasses="py-3 text-right"
                >{`TOTAL: ${cartTotal?.toFixed(2)}€`}</TextHeading3>
              </View>

              <ButtonPrimaryEnd
                label="Mes modes de retrait"
                iconName="arrow-right"
                onPressFn={handleWithdrawModePress}
                extraClasses="mt-5 mb-3 h-14"
              />

              <ButtonSecondaryStart
                label="Continuer vos achats"
                iconName="arrow-left"
                disabled={false}
                isLoading={false}
                onPressFn={() => navigation.navigate("MapCustomer")}
                extraClasses="h-14"
              />
            </ScrollView>
          </>
        ) : (
          <View className="h-full justify-center items-center px-3">
            <TextHeading2 extraClasses="mb-4">
              Votre panier est vide :(
            </TextHeading2>
            <ButtonPrimaryStart
              label="Continuer vos achats"
              disabled={false}
              iconName="arrow-left"
              onPressFn={() => navigation.navigate("MapCustomer")}
              extraClasses="h-14"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
