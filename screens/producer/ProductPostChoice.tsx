import React from "react";
import { useState, useEffect } from "react";

import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { StocksState } from "../../reducers/stocks";

import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { ShopState } from "../../reducers/shop";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import PostChoiceProductCard from "../../components/cards/PostChoiceProduct";

type ProductPostChoiceScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductPostChoice"
>;

type ProductPostChoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductPostChoice"
>;

type Props = {
  navigation: ProductPostChoiceScreenNavigationProp;
};

export default function ProductPostChoiceScreen({ navigation }: Props) {
  const route = useRoute<ProductPostChoiceScreenRouteProp>();
  // const { from, backLabel, screenTitle, shopCategoriesWithFamilies } =
  //   route.params || {};
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.shopCategoriesWithFamilies,
  );
  const [shopCategoriesWithFamilies, setShopCategoriesWithFamilies] =
    useState(stocksStore);

  // création des collapsibleSections et sous sections
  const categorySections =
    shopCategoriesWithFamilies?.map((category) => {
      const categorySection = useCollapsibleSection();

      const hasClassic = category.families.some((family) => family.isClassic);

      const categoryStocks = shopStore?.products?.filter(
        (stock) => stock.product.family.category._id === category.category._id,
      );

      const familiesSection = category.families.map((family) => {
        if (!family.isClassic) return null;

        const familySection = useCollapsibleSection();

        const familyStocks = categoryStocks?.filter(
          (stock) => stock.product.family._id === family.family._id,
        );

        return (
          <View key={family.family._id} className="">
            <OpenMenuButton
              label={family.family.name}
              onPressFn={familySection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[familySection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={(event) => {
                  familySection.onLayout(event);
                  // on laisse un délai pour laisser le temps au onLayout avant de lancer
                  // un refresh de la section parent
                  setTimeout(() => {
                    categorySection.refresh();
                  }, 50);
                }}
                style={familySection.innerContainerStyle}
                className="px-3 pb-3"
              >
                {familyStocks?.map((stock) => (
                  <PostChoiceProductCard
                    key={stock._id}
                    stock={stock}
                    onPress={() => {
                      navigation.navigate("CreatePost", {
                        from: "ProductPostChoice",
                        backLabel: "Retour au choix",
                        screenTitle: "CRÉATION\nDU POST",
                        stock: stock,
                      });
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </View>
        );
      });

      const renderContent = hasClassic ? (
        <View>{familiesSection}</View>
      ) : (
        <View className="px-3">
          {categoryStocks?.map((stock) => (
            <PostChoiceProductCard
              key={stock._id}
              stock={stock}
              onPress={() => {
                navigation.navigate("CreatePost", {
                  from: "ProductPostChoice",
                  backLabel: "Retour au choix",
                  screenTitle: "CRÉATION\nDU POST",
                  stock: stock,
                });
              }}
            />
          ))}
        </View>
      );

      return (
        <View key={category.category._id}>
          <OpenMenuButton
            label={category.category.name}
            onPressFn={categorySection.toggle}
            extraClasses="mb-2"
          />
          <Animated.View
            style={[categorySection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={categorySection.onLayout}
              style={categorySection.innerContainerStyle}
              className="px-3"
            >
              {renderContent}
            </View>
          </Animated.View>
        </View>
      );
    }) ?? [];

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au type"}
          screen={from || "PostType"}
          label={screenTitle || "CHOISIR\nUN PRODUIT"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 12 }}>
        <ScrollView>{categorySections}</ScrollView>
      </View>
    </SafeAreaView>
  );
}
