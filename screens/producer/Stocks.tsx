import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useColorScheme } from "nativewind";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SheetManager } from "react-native-actions-sheet";

import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StockProductCard from "../../components/cards/StockProductCard";
import TextHeading1 from "../../components/utils/texts/Heading1";
import EditProduct from "../../components/EditProduct";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import { StocksState } from "../../reducers/stocks";

type StocksScreenRouteProp = RouteProp<RootStackParamList, "Stocks">;

type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Stocks"
>;

type Props = {
  navigation: StocksScreenNavigationProp;
};

export default function StocksScreen({ navigation }: Props) {
  const route = useRoute<StocksScreenRouteProp>();
  const { from, backLabel, screenTitle, category, family } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.value,
  );

  const productsType = stocksStore
    .find((element) => element.categoryName === category)
    ?.productsTypes.toString();

  const filteredProducts =
    productsType === "bulk"
      ? shopStore?.products?.filter(
          (product: StockData) =>
            product.product.family.category.name === category,
        )
      : shopStore?.products?.filter(
          (product: StockData) => product.product.family.name === family,
        );

  const handleOpenEdit = (product: StockData) => {
    // console.log(product);
    SheetManager.show("edit-product", {
      payload: { stock: product },
    });
  };

  // console.log("------------------------------------ STOCKS")
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  // console.log("category:", category);
  // console.log("family :", family)

  return (
    <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
      <TopBar
        backLabel={
          backLabel || family ? "Retour au choix" : "Retour aux catégories"
        }
        screen={from || "StockCategories"}
        screenParams={{
          category: category,
          family: family,
        }}
        label={screenTitle || "STOCK\n" + (family ? family : category)}
        extraClasses="mt-2"
      />
      <View className="px-3 mb-3">
        <OpenScreenButton
          label="Ajouter un produit"
          bgColor="bg-tertiary"
          onPressFn={() =>
            navigation.navigate("StocksAdd", {
              from: "Stocks",
              backLabel: "Retour au stock",
              screenTitle: "AJOUTER\nUN PRODUIT",
              category: category,
              family: family,
            })
          }
          extraClasses=""
        />
      </View>
      <ScrollView>
        <View className="px-3">
          {filteredProducts?.map((product) => (
            <StockProductCard
              key={product._id}
              stock={product}
              onPress={() => handleOpenEdit(product)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
