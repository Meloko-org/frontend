import React from "react";
import { useState, useEffect } from "react";
import { SheetManager } from "react-native-actions-sheet";

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
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";

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

  const [openScreenButtons, setOpenScreenButtons] = useState<JSX.Element[]>([]);

  const availableFamilies = Array.from(
    new Set(
      shopStore?.products
        ?.filter((product) => product.product.family.category.name === category)
        ?.map((product) => product.product.family.name),
    ),
  );

  useEffect(() => {
    setOpenScreenButtons(
      availableFamilies.map((family, index) => {
        return (
          <OpenScreenButton
            key={index}
            label={family}
            onPressFn={() =>
              navigation.navigate("Stocks", {
                from: "StockFamilies",
                backLabel: "Retour au choix " + category,
                screenTitle: "STOCK\n" + family,
                category: category,
                family: family,
              })
            }
            extraClasses="mb-1"
          />
        );
      }),
    );
  }, []);

  // console.log("------------------------------------ STOCKFAMILIES");
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  // console.log("category:", category);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour aux catégories"}
          screen={from || "StockCategories"}
          label={screenTitle || "CHOIX\n" + category}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="px-3">{openScreenButtons}</View>
        </ScrollView>

        <View className="px-3 my-3">
          <OpenScreenButton
            label={`Ajouter une catégorie de ${category}`}
            bgColor="bg-tertiary"
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
                        onPressFn={() =>
                          navigation.navigate("Stocks", {
                            from: "StockFamilies",
                            backLabel: "Retour au choix",
                            screenTitle: newfamilyName,
                            category: category,
                            family: newfamilyName,
                          })
                        }
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
