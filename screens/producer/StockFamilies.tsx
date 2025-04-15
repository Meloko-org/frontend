import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

type StockFamiliesScreenRouteProp = RouteProp<
  RootStackParamList,
  "StockFamilies"
>;

type StockFamiliesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockFamilies"
>;

type Props = {
  navigation: StockFamiliesScreenNavigationProp;
};

export default function StockFamiliesScreen({ navigation }: Props) {
  const route = useRoute<StockFamiliesScreenRouteProp>();
  const { from, backLabel, screenTitle, category } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [products, setProducts] = useState<StockData[] | undefined>([]);

  useEffect(() => {
    setProducts(
      shopStore?.products?.map((product) => {
        return product;
      }),
    );
  }, []);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour aux catégories"}
          screen={from || "StockCategories"}
          label={screenTitle || ""}
          extraClasses="mt-2"
        />

        <ScrollView></ScrollView>
      </SafeAreaView>
    </View>
  );
}
