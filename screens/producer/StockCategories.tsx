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
import { ProductCategoryData, StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import categoriesTools from "../../modules/categoriesTools";

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
  const [shopTypes, setShopTypes] = useState<string[]>([]);
  const [globalCategories, setGlobalCategories] = useState<
    ProductCategoryData[]
  >([]);
  // const [categories, setCategories] = useState<string[]>([]);
  const [openScreenButtons, setOpenScreenButtons] = useState<JSX.Element[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      // récupération des types du shop
      if (shopStore !== null) {
        setShopTypes(shopStore.types.map((type: { _id: string }) => type._id));
      }
      // récupération des catégories globales
      fetchGlobalCategories();
      // récupération des stocks
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
    dispatch(addProducts(stocksResponse.data!));
    setStocks(stocksResponse.data);

    setIsFetchLoading(false);
  };

  const fetchGlobalCategories = async () => {
    const categoriesResponse = await categoriesTools.getGlobalCategories();

    if (!categoriesResponse.success) {
      console.log(categoriesResponse.message);
      return;
    }

    // console.log("les categories :", categoriesResponse.data)

    setGlobalCategories(categoriesResponse.data);
  };

  useEffect(() => {
    if (!isFetchLoading) {
      // on détermine les catégories possibles en fonction des types du shop
      const availableCategories = globalCategories.filter((category) =>
        shopStore!.types.some(
          (shopType: { _id: string }) => shopType._id === category.type,
        ),
      );

      console.log("avalableCategories: ", availableCategories);

      // on ajoute le nombre de produits pour chaque catégorie qui appartient aux types du shop
      const availableCategoriesWithCount = availableCategories.map(
        (category) => {
          console.log("available cat id : ", category.type);
          const count = shopStore!.products?.filter(
            (p) => p.product.family.category.type === category.type,
          ).length;
          return {
            ...category,
            count,
          };
        },
      );

      console.log("categories with count :", availableCategoriesWithCount);

      setOpenScreenButtons(
        availableCategoriesWithCount.map((cat) => {
          return (
            <OpenScreenButton
              key={cat._id}
              label={cat.name}
              notice={cat.count?.toString()}
              onPressFn={() =>
                navigation.navigate("Stocks", {
                  from: "StockCategories",
                  backLabel: "Retour aux catégories",
                  screenTitle: "STOCKS\n" + cat.name.toLocaleUpperCase(),
                  category: cat.name,
                })
              }
              extraClasses="mb-1"
            />
          );
        }),
      );
    }
  }, [isFetchLoading]);

  // console.log("shopTypes :", JSON.stringify(shopStore.products, null, 2))

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
