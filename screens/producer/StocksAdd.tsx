import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SheetManager } from "react-native-actions-sheet";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { ProductData, StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import productsTools from "../../modules/productsTools";
import SecondaryButton from "../../components/utils/buttons/Secondary";
import TextBody1 from "../../components/utils/texts/Body1";
import { StocksState } from "../../reducers/stocks";

type StocksAddScreenRouteProp = RouteProp<RootStackParamList, "StocksAdd">;

type StocksAddScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StocksAdd"
>;

type Props = {
  navigation: StocksAddScreenNavigationProp;
};

export default function StocksAddScreen({ navigation }: Props) {
  const route = useRoute<StocksAddScreenRouteProp>();
  const { from, backLabel, screenTitle, category, family } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.value,
  );

  const [products, setProducts] = useState<ProductData[] | undefined>([]);
  // const [ secondaryButtons, setSecondaryButtons ] = useState<JSX.Element[]>()

  // récupère les produits bulk
  const fetchProductsForCategory = async () => {
    console.log("fetchProductsForCategory");
    const productsResponse =
      await productsTools.getProductsForCategory(category);

    if (!productsResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: productsResponse.message!,
          alertType: "error",
        },
      });
      return;
    }

    if (productsResponse.data) {
      const productsForCategoryInStore = shopStore?.products?.filter(
        (product) => product.product.family.category.name === category,
      );

      const existingProductIds = new Set(
        productsForCategoryInStore?.map((product) => product.product._id),
      );

      const availableProducts = productsResponse.data.filter(
        (product) => !existingProductIds.has(product._id),
      );

      setProducts(availableProducts);
    }
  };

  // récupère les produits classic
  const fetchProductsForFamily = async () => {
    console.log("fetchProductsForFamily");
    const productsResponse = await productsTools.getProductsForFamily(family!);

    if (!productsResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: productsResponse.message!,
          alertType: "error",
        },
      });
      return;
    }

    if (productsResponse.data) {
      const existingProducts = new Set(
        shopStore?.products
          ?.filter((product) => product.product.family.name === family)
          ?.map((product) => product.product),
      );
      const availableProducts = productsResponse.data.filter(
        (product) => !existingProducts.has(product),
      );
      setProducts(availableProducts);
    }
  };

  const renderButtons = () => {
    if (!products || products.length === 0) return null;

    const productsType = stocksStore
      .find((element) => element.categoryName === category)
      ?.productsTypes.toString();

    return products.map((product) => {
      const label =
        productsType === "bulk"
          ? `${product.family.name} ${product.name}`
          : product.name;

      return (
        <SecondaryButton
          key={product._id}
          label={label}
          disabled={false}
          isLoading={false}
          onPressFn={() => {
            SheetManager.show("edit-product", {
              payload: {
                stock: null,
                product: product,
                productsType: productsType,
              },
            });
          }}
          extraClasses="h-14 mb-3"
          textClasses="text-xl"
        />
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setProducts([]); // force le rerender

      const productsType = stocksStore
        .find((element) => element.categoryName === category)
        ?.productsTypes.toString();

      if (productsType === "bulk") {
        fetchProductsForCategory();
      }

      if (productsType === "classic") {
        fetchProductsForFamily();
      }
    }, [category, family, stocksStore]),
  );

  // console.log("------------------------------------ STOCKSADD")
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  // console.log("category:", category);
  // console.log("family :", family)

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour aux stocks"}
          screen={from || "StockCategories"}
          label={screenTitle || ""}
          screenParams={{
            category: category,
            family: family,
          }}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="p-3">{renderButtons()}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
