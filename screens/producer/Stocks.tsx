import React, { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAuth } from "@clerk/clerk-expo";

import { useSelector, useDispatch } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { StocksState } from "../../reducers/stocks";
import { setProducts } from "../../reducers/shop";

import { StockData } from "../../types/API";
import stocksTools from "../../modules/stocksTools";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SheetManager } from "react-native-actions-sheet";
import {
  handleSheetFlow,
  showAlert,
  showConfirm,
} from "../../helpers/sheetHelpers";

import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StockProductCard from "../../components/cards/StockProductCard";
import TextHeading1 from "../../components/utils/texts/Heading1";
import EditProduct from "../../components/EditProduct";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

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

  console.error(shopStore?.products?.length);

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

  // const handleOpenEdit = async (product: StockData) => {
  //   await handleSheetFlow({
  //     sheet: "edit-product",
  //     payload: { stock: product },
  //     onAfter: async (action) => {
  //       switch (action) {
  //         case "edit-success":
  //           await showAlert("Modification effectuée.", "success");
  //           break;
  //         case "edit-failed":
  //           await showAlert(" Echec de la modification", "error");
  //           break;
  //         case "delete":
  //           const confirmed = await showConfirm("supprimer ce produit ?");
  //           if (!confirmed) return;
  //           console.log("product Id :", product._id);
  //           await deleteProduct(product._id);
  //           break;
  //         default:
  //           break;
  //       }
  //     },
  //   });
  // };

  // const deleteProduct = async (id: string) => {
  //   const token = await getToken();
  //   const deleteResponse = await stocksTools.deleteStocks(token, id);

  //   if (!deleteResponse.success) {
  //     await showAlert(deleteResponse.message!, "error");
  //     return false;
  //   }

  //   dispatch(setProducts(deleteResponse.data!));

  //   await showAlert("Produit supprimé.", "success");
  //   return true;
  // };

  // console.log("------------------------------------ STOCKS");
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  // console.log("category:", category);
  // console.log("family :", family);

  return (
    <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
      <TopBar
        backLabel={
          backLabel || (family ? "Retour au choix" : "Retour aux catégories")
        }
        screen={from || (family ? "StockFamilies" : "StockCategories")}
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
        <View className="px-3">{filteredProducts}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
