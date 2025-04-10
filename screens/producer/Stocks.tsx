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
  const { from, backLabel, screenTitle, category } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const filteredProducts = shopStore?.products?.filter(
    (product: StockData) => product.product.family.category.name === category,
  );

  const handleOpenEdit = (product: StockData) => {
    console.log("youpi");
    SheetManager.show("EditProductSheet", {
      payload: { stock: product },
    });
  };

  // console.log(JSON.stringify(filteredProducts, null, 2))

  return (
    <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour aux catégories"}
        screen={from || "StockCategories"}
        label={screenTitle || "STOCK\n" + category}
        extraClasses="mt-2"
      />

      <View className="px-3">
        <OpenScreenButton
          label="Ajouter un produit"
          onPressFn={() =>
            navigation.navigate("StocksAdd", {
              from: "Stocks",
              backLabel: "Retour au stock",
              screenTitle: "AJOUTER\nUN PRODUIT",
              category: category,
            })
          }
          extraClasses="mb-2"
        />
      </View>

      <ScrollView>
        <View className="px-3">
          {filteredProducts?.map((product, index) => (
            <StockProductCard
              key={index}
              stock={product}
              onPress={() => handleOpenEdit(product)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
