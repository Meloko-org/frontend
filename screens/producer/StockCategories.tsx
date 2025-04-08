import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { addProducts, resetProducts, ShopState } from "../../reducers/shop";

import stocksTools from "../../modules/stocksTools";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import Spinner from "../../components/utils/Spinner";
import { StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

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

  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [shopId, setShopId] = useState<string>(shopStore!._id);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockData[] | null>([]);
  // const [categories, setCategories] = useState<string[]>([]);
  const [openScreenButtons, setOpenScreenButtons] = useState<JSX.Element[]>([]);

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

    // console.log("stocksResponse :", stocksResponse.data)
    dispatch(resetProducts());
    dispatch(addProducts(stocksResponse.data));
    setStocks(stocksResponse.data);

    setIsFetchLoading(false);
  };

  useEffect(() => {
    if (!isFetchLoading && stocks.length > 0) {
      // suppression des doublons de catégorie
      const categoriesList: string[] = Array.from(
        new Set(stocks?.map((stock) => stock?.product.family.category.name)),
      );
      // setCategories(categoriesList);

      setOpenScreenButtons(
        categoriesList.map((cat: string) => {
          return (
            <OpenScreenButton
              key={cat}
              label={cat}
              onPressFn={() =>
                navigation.navigate("Stocks", {
                  from: "StockCategories",
                  backLabel: "Retour aux catégories",
                  screenTitle: "STOCKS\n" + cat.toLocaleUpperCase(),
                  category: cat,
                })
              }
              extraClasses="mb-1"
            />
          );
        }),
      );
    }
  }, [isFetchLoading]);

  // console.log("stocks :", stocks);
  // console.log(categories);
  // console.log("shopStore :", shopStore)

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à la boutique"}
          screen={from || "ShopProducer"}
          label={screenTitle || "GESTION\nDES STOCKS"}
          extraClasses="mt-2"
        />
        <ScrollView>
          {isFetchLoading ? (
            <Spinner />
          ) : (
            <View className="px-3">{openScreenButtons}</View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
