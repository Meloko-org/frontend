import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import stocksTools from "../../modules/stocksTools";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import Spinner from "../../components/utils/Spinner";
import { StockData } from "../../types/API";

type StockCategoriesScreenRouteProp = RouteProp<
  RootStackParamList,
  "StockCategories"
>;

type StockCategoriesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockCategories"
>;

type Props = {
  navigation: StockCategoriesScreenNavigationProp;
};

export default function StockCategoriesScreen({ navigation }: Props) {
  const route = useRoute<StockCategoriesScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [shopId, setShopId] = useState<string>(shopStore!._id);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchStocks();
    }, []),
  );

  const fetchStocks = async () => {
    const stocksResponse = await stocksTools.getStocksByShop(shopId);

    if (!stocksResponse.success) {
      console.error(stocksResponse.message);
      return;
    }

    const formattedData = stocksResponse.data?.map((item: StockData) => ({
      _id: item?._id,
      price: parseFloat(item.price.$numberDecimal),
      stock: parseInt(item.stock.$numberDecimal, 10),
      shop: item?.shop, // en supposant que shop est déjà formaté selon ShopData
      product: item?.product, // en supposant que product est formaté selon ProductData
      tags: item?.tags,
    }));
    setStocks(formattedData);
    setIsFetchLoading(false);

    console.log("formattedData :", formattedData);
  };

  useEffect(() => {
    if (!isFetchLoading && stocks.length > 0) {
      const categoriesList: string[] = Array.from(
        new Set(stocks?.map((stock) => stock?.product.family.category.name)),
      );
      setCategories(categoriesList);
    }
  }, [isFetchLoading]);
  console.log(categories);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à la boutique"}
          screen={from || "ShopProducer"}
          label={screenTitle || ""}
          extraClasses="mt-2"
        />
        <ScrollView>
          <View className="px-3"></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
