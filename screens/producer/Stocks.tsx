import React, { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAuth } from "@clerk/clerk-expo";

import { useSelector, useDispatch } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { StocksState } from "../../reducers/stocks";
import { setProducts } from "../../reducers/shop";

import { StockData } from "../../types/API";
import stocksTools from "../../modules/stocksTools";

// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../types/Navigation";
// import { useFocusEffect, useRoute } from "@react-navigation/native";
// import { RouteProp } from "@react-navigation/native";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StockProductCard from "../../components/cards/StockProductCard";

type FromProducerTab = BottomTabScreenProps<ProducerTabParamList, "Stocks"> & {
  category: string;
  family: string;
};

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingStocks"
> & {
  category: string;
  family: string;
};

type Props = FromProducerTab | FromRootStack;

export default function StocksScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, category, family, onboarding } =
    route.params || {};

  const { getToken } = useAuth();

  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.value,
  );

  useFocusEffect(
    React.useCallback(() => {
      // permet un refresh du composant
    }, [shopStore?.products]),
  );

  const productsType = stocksStore
    .find((element) => element.categoryName === category)
    ?.productsTypes.toString();

  console.warn(shopStore?.products?.length);

  const filteredProducts =
    productsType === "bulk"
      ? shopStore?.products
          ?.filter(
            (product: StockData) =>
              product.product.family.category.name === category,
          )
          .map((product) => (
            <StockProductCard
              key={product._id}
              stock={product}
              onPress={() => handleOpenEdit(product)}
            />
          ))
      : shopStore?.products
          ?.filter(
            (product: StockData) => product.product.family.name === family,
          )
          .map((product) => (
            <StockProductCard
              key={product._id}
              stock={product}
              onPress={() => handleOpenEdit(product)}
            />
          ));

  const handleOpenEdit = (stockData: StockData) => {
    navigation.navigate("StocksEdit", {
      from: "Stocks",
      backLabel: "Retour au stock " + (family ? family : category),
      screenTitle: "FICHE\nPRODUIT",
      category: category,
      family: family,
      stockData: stockData,
    });
  };

  console.log(stocksStore);

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <TopBar
        backLabel={
          backLabel || onboarding
            ? "Retour aux stocks"
            : family
              ? "Retour au choix"
              : "Retour aux catégories"
        }
        screen={
          from || onboarding
            ? "OnboardingStockCategories"
            : family
              ? "StockFamilies"
              : "StockCategories"
        }
        screenParams={{
          category: category,
          family: family,
          onboarding,
        }}
        label={screenTitle || "STOCK\n" + (family ? family : category)}
        extraClasses="my-2"
      />
      <View className="px-3 mb-3">
        <OpenScreenButton
          label="Ajouter un produit"
          // bgColor="bg-tertiary"
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
        <View className="px-3">{filteredProducts}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
