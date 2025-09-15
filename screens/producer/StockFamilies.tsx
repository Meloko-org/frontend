import React, { JSX } from "react";
import { useState, useEffect } from "react";
import { SheetManager } from "react-native-actions-sheet";

// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../types/Navigation";
// import { useRoute } from "@react-navigation/native";
// import { RouteProp } from "@react-navigation/native";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { StockData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";

// type StockFamiliesScreenRouteProp = RouteProp<
//   RootStackParamList,
//   "StockFamilies"
// >;

// type StockFamiliesScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "StockFamilies"
// >;

// type Props = {
//   navigation: StockFamiliesScreenNavigationProp;
// };

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "StockFamilies"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingStockFamilies"
>;

type Props = FromProducerTab | FromRootStack;

export default function StockFamiliesScreen({ navigation, route }: Props) {
  // const route = useRoute<StockFamiliesScreenRouteProp>();
  const { from, backLabel, screenTitle, category, onboarding } =
    route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [openScreenButtons, setOpenScreenButtons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const availableFamilies = Array.from(
      new Set(
        shopStore?.products
          ?.filter(
            (product) => product.product.family.category.name === category,
          )
          ?.map((product) => product.product.family.name),
      ),
    );

    const availableFamiliesWithCount = availableFamilies.map((family) => {
      const count = shopStore!.products?.filter(
        (p) => p.product.family.name === family,
      ).length;
      return {
        family,
        count,
      };
    });
    setOpenScreenButtons(
      availableFamiliesWithCount.map((family, index) => {
        const productsInFamily = shopStore!.products?.filter(
          (p) => p.product.family.name === family.family,
        );

        const hasZeroStock = productsInFamily?.some((product) => {
          return Number(product.stock.$numberDecimal) === 0;
        });

        return (
          <OpenScreenButton
            key={index}
            label={family.family}
            notice={family.count?.toString()}
            redAlert={hasZeroStock}
            onPressFn={() => {
              if (onboarding) {
                (navigation as FromRootStack["navigation"]).navigate(
                  "OnboardingStocks",
                  {
                    from: "OnboardingStockCategories",
                    backLabel: "Retour au choix " + category,
                    screenTitle: "STOCK\n" + family.family,
                    onboarding: true,
                    category: category,
                    family: family.family,
                  },
                );
              } else {
                (navigation as FromProducerTab["navigation"]).navigate(
                  "Stocks",
                  {
                    from: "StockCategories",
                    backLabel: "Retour au choix " + category,
                    screenTitle: "STOCK\n" + family.family,
                    category: category,
                    family: family.family,
                  },
                );
              }
            }}
            extraClasses="mb-1"
          />
        );
      }),
    );
  }, [shopStore?.products]);

  // console.log("------------------------------------ STOCKFAMILIES");
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  // console.log("category:", category);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView
        className="bg-lightbg flex-1 dark:bg-darkbg"
        edges={["right", "left", "top"]}
      >
        <TopBar
          backLabel={backLabel || "Retour aux catégories"}
          screen={
            from || onboarding ? "OnboardingStockCategories" : "StockCategories"
          }
          label={screenTitle || "CHOIX\n" + category}
          screenParams={{ onboarding }}
          extraClasses="my-2"
        />

        <ScrollView>
          <View className="px-3">{openScreenButtons}</View>
        </ScrollView>

        <View className="px-3 my-3">
          <OpenScreenButton
            label={`Ajouter une catégorie de ${category}`}
            // bgColor="bg-tertiary"
            onPressFn={() => {
              SheetManager.show("product-families", {
                payload: {
                  category: category,
                  onFamilySelected: (newfamilyName: string) => {
                    setOpenScreenButtons((prev) => [
                      ...prev,
                      <OpenScreenButton
                        key={newfamilyName}
                        label={newfamilyName}
                        onPressFn={() => {
                          if (onboarding) {
                            (
                              navigation as FromRootStack["navigation"]
                            ).navigate("OnboardingStocks", {
                              from: "OnboardingStockFamilies",
                              backLabel: "Retour au choix",
                              screenTitle: newfamilyName,
                              category: category,
                              family: newfamilyName,
                              onboarding: true,
                            });
                          } else {
                            (
                              navigation as FromProducerTab["navigation"]
                            ).navigate("Stocks", {
                              from: "StockFamilies",
                              backLabel: newfamilyName,
                              screenTitle: "***",
                              category: category,
                              family: newfamilyName,
                            });
                          }
                        }}
                        extraClasses="mb-1"
                      />,
                    ]);
                  },
                },
              });
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
