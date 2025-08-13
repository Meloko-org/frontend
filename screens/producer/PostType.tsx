import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import {
  StocksState,
  setShopCategoriesWithFamilies,
} from "../../reducers/stocks";
import { ShopState } from "../../reducers/shop";
import {
  ProductCategoryData,
  ProductFamilyData,
  ShopCategoriesWithFamiliesData,
} from "../../types/API";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

type PostTypeScreenRouteProp = RouteProp<RootStackParamList, "PostType">;

type PostTypeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostType"
>;

type Props = {
  navigation: PostTypeScreenNavigationProp;
};

export default function PostTypeScreen({ navigation }: Props) {
  const route = useRoute<PostTypeScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const dispatch = useDispatch();

  /**
   * on calcule ici les catégories de produits avec les familles et on les
   * enregistre dans le stocksStore car pour pouvoir créer des collapsibleSections imbriquées
   * selon les catégories et les familles dans ProductPostChoice, le map doit se faire
   * sur une valeur définié au premier rendu.
   * Dans ProductPostChoice, il suffit de créer un state qui s'initialise la propriété
   * shopCategoriesWithFamilies du stocks reducer et de faire le map sur ce state.
   */

  useEffect(() => {
    if (!shopStore?.products) return;

    const categoryMap = new Map<
      string,
      {
        category: ProductCategoryData;
        families: Map<
          string,
          { family: ProductFamilyData; isClassic: boolean }
        >;
      }
    >();

    shopStore.products.forEach((stock) => {
      const { family } = stock.product;
      const category = family.category;

      if (!categoryMap.has(category._id)) {
        categoryMap.set(category._id, {
          category: category,
          families: new Map(),
        });
      }

      const categoryEntry = categoryMap.get(category._id)!;

      // Ajout de la famille si elle n'existe pas encore
      if (!categoryEntry.families.has(family._id)) {
        categoryEntry.families.set(family._id, {
          family,
          isClassic: family.productsTypes.includes("classic"),
        });
      }
    });

    // Transforme en tableau final
    const result: ShopCategoriesWithFamiliesData[] = Array.from(
      categoryMap.values(),
    ).map((entry) => ({
      category: entry.category,
      families: Array.from(entry.families.values()),
    }));

    dispatch(setShopCategoriesWithFamilies(result));
  }, []);

  // console.log("POSTYPE :", JSON.stringify(shopStore?.notes, null, 2));

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au premium"}
          screen={from || "PremiumOptions"}
          label={screenTitle || "TYPE DE\nPOST"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 12 }}>
        <OpenScreenButton
          label="Produit"
          onPressFn={() => {
            navigation.navigate("ProductPostChoice", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "CHOISIR\nUN PRODUIT",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Avis"
          onPressFn={() => {
            navigation.navigate("NoticePostChoice", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "CHOISIR\nUN AVIS",
            });
          }}
          extraClasses="mb-1"
        />
        <OpenScreenButton
          label="Activité"
          onPressFn={() => {
            navigation.navigate("ActivityPostChoice", {
              from: "PostType",
              backLabel: "Retour au type",
              screenTitle: "CHOISIR UNE\nACTIVITE",
            });
          }}
          extraClasses="mb-1"
        />
      </View>
    </SafeAreaView>
  );
}
