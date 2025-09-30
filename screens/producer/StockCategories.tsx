import React, { JSX } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useFocusEffect } from "@react-navigation/native";
import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useDispatch, useSelector } from "react-redux";
import {
  addProducts,
  resetProducts,
  setProducts,
  setShopData,
  ShopState,
} from "../../reducers/shop";
import { setProductsTypes, StocksState } from "../../reducers/stocks";

import stocksTools from "../../modules/stocksTools";
import categoriesTools from "../../modules/categoriesTools";
import shopTools from "../../modules/shopTools";

import {
  ProductCategoryData,
  ProductsTypesByCategory,
  StockData,
} from "../../types/API";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View } from "react-native";
import TopBar from "../../components/TopBar";
import Spinner from "../../components/utils/Spinner";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import PrimaryButton from "../../components/utils/buttons/Primary";
import TextBody1 from "../../components/utils/texts/Body1";

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "StockCategories"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingStockCategories"
>;

type Props = FromProducerTab | FromRootStack;

export default function StockCategoriesScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  const { getToken } = useAuth();

  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.value,
  );

  const [shopId, setShopId] = useState<string | null>(shopStore?._id ?? null);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockData[] | null>([]);
  const [shopTypes, setShopTypes] = useState<string[]>([]);
  const [globalCategories, setGlobalCategories] = useState<
    ProductCategoryData[] | null
  >([]);
  const [isStockSetted, setIsStockSetted] = useState<boolean | undefined>(
    false,
  );

  const [openScreenButtons, setOpenScreenButtons] = useState<JSX.Element[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        // récupération des types du shop
        if (shopStore !== null) {
          setShopTypes(
            shopStore.types.map((type: { _id: string }) => type._id),
          );
        } else {
          const token = await getToken();
          const shopResponse = await shopTools.getShopInfos(token);
          if (shopResponse.success && shopResponse.data) {
            setShopTypes(
              shopResponse.data.types.map((type: { _id: string }) => type._id),
            );
            dispatch(setShopData(shopResponse.data));
          }
        }

        // récupération des catégories globales
        fetchGlobalCategories();
        // récupération des types de produits par catégorie
        fetchProductsTypes();
        // récupération des stocks si on n'est pas dans le cas d'un onboarding
        if (!onboarding) {
          fetchStocks();
        }
        setIsFetchLoading(false);
      };

      init();
    }, [shopStore]),
  );

  const fetchStocks = async () => {
    const stocksResponse = await stocksTools.getStocksByShop(shopId);

    if (!stocksResponse.success) {
      console.warn(stocksResponse.message);
      return;
    }

    dispatch(setProducts(stocksResponse.data!));
    setStocks(stocksResponse.data);

    setIsFetchLoading(false);
  };

  const fetchProductsTypes = async () => {
    // retourne les types de produit ("bulk", "classic"... ) pour chaque catégorie
    const productsTypesResponse =
      await stocksTools.getProductsTypesByCategory();

    if (!productsTypesResponse.success) {
      console.log(productsTypesResponse.message);
      return;
    }

    // console.log("catégories de produits avec type :", JSON.stringify(productsTypesResponse.data, null, 2));

    if (productsTypesResponse.success && productsTypesResponse.data) {
      const formatted: ProductsTypesByCategory[] = Object.entries(
        productsTypesResponse.data,
      ).map(([categoryName, productsTypes]) => ({
        categoryName,
        productsTypes,
      }));

      // console.log("categories avec types de produits du shop:", JSON.stringify(formatted, null, 2));

      dispatch(setProductsTypes(formatted));
    }
  };

  const fetchGlobalCategories = async () => {
    const categoriesResponse = await categoriesTools.getGlobalCategories();
    if (!categoriesResponse.success) {
      console.log(categoriesResponse.message);
      return;
    }
    setGlobalCategories(categoriesResponse.data);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("youpi")

  //   }, [shopStore?.products, globalCategories, stocksStore])
  // )

  useEffect(() => {
    if (!isFetchLoading) {
      // on détermine les catégories possibles en fonction des types du shop
      const availableCategories = globalCategories?.filter((category) =>
        shopStore?.types?.some(
          (shopType: { _id: string }) => shopType._id === category.type,
        ),
      );

      // console.log("availableCategories :", availableCategories);

      /* on ajoute le nombre de produits pour chaque catégorie qui appartient aux types du shop
        si on n'est pas dans le cas du onboarding ou si on est dans le cas du onboarding et 
        qu'au moins un produit a été ajouté. 
        Dans le cas du onboarding, tant qu'aucun produit n'a été ajouté, on met count à 0
      */
      const availableCategoriesWithCount = availableCategories?.map(
        (category) => {
          let count;
          if (!onboarding || (onboarding && shopStore?.products !== null)) {
            count = shopStore?.products?.filter(
              (p) => p.product.family.category.name === category.name,
            ).length;
          } else {
            count = 0;
          }
          return {
            ...category,
            count,
          };
        },
      );

      /* Activation du bouton "Valider les produits" si au moins un produit a été ajouté pendant le onboarding */
      if (onboarding) {
        const hasProduct = availableCategoriesWithCount?.some(
          (cat) => cat.count! > 0,
        );
        setIsStockSetted(hasProduct);
      }

      console.log(
        "availableCategoriesWithCount :",
        JSON.stringify(availableCategoriesWithCount, null, 2),
      );

      setOpenScreenButtons(
        availableCategoriesWithCount!.map((cat, index) => {
          const productsType = stocksStore
            .find((element) => element.categoryName === cat.name)
            ?.productsTypes.toString();

          // liste des produits pour une catégorie
          const productsInCategory = shopStore!.products?.filter(
            (p) => p.product.family.category.name === cat.name,
          );

          // vérification des stocks de chaque produit pour une catégorie
          const hasZeroStock = productsInCategory?.some((product) => {
            return Number(product.stock) === 0;
          });

          return (
            <OpenScreenButton
              key={index}
              label={cat.name}
              notice={cat.count?.toString()}
              redAlert={hasZeroStock}
              onPressFn={() => {
                if (onboarding) {
                  if (productsType === "bulk") {
                    (navigation as FromRootStack["navigation"]).navigate(
                      "OnboardingStocks",
                      {
                        from: "OnboardingStockCategories",
                        backLabel: "Retour aux stocks",
                        screenTitle: "STOCKS\n" + cat.name.toLocaleUpperCase(),
                        category: cat.name,
                        onboarding: true,
                      },
                    );
                  } else {
                    (navigation as FromRootStack["navigation"]).navigate(
                      "OnboardingStockFamilies",
                      {
                        from: "OnboardingStockCategories",
                        backLabel: "Retour aux stocks",
                        screenTitle: "CHOIX\n" + cat.name.toLocaleUpperCase(),
                        category: cat.name,
                        onboarding: true,
                      },
                    );
                  }
                } else {
                  if (productsType === "bulk") {
                    (navigation as FromProducerTab["navigation"]).navigate(
                      "Stocks",
                      {
                        from: "Shop",
                        backLabel: "Retour à la boutique",
                        screenTitle: "STOCKS\n" + cat.name.toLocaleUpperCase(),
                        category: cat.name,
                      },
                    );
                  } else {
                    (navigation as FromProducerTab["navigation"]).navigate(
                      "StockFamilies",
                      {
                        from: "Shop",
                        backLabel: "Retour à la boutique",
                        screenTitle: "CHOIX\n" + cat.name.toLocaleUpperCase(),
                        category: cat.name,
                      },
                    );
                  }
                }
              }}
              extraClasses="mb-1"
            />
          );
        }),
      );
    }
  }, [shopStore?.products, globalCategories, stocksStore]);

  // console.log("STOCKCATEGORIES shopStore :", JSON.stringify(shopStore, null, 2))
  // console.log("STOCKCATEGORIES onboarding :", onboarding)
  // console.log("STOCKCATEGORIES shopTypes :", shopTypes)
  console.log("stockStore :", stocksStore);
  console.log("shopStore products :", shopStore?.products);

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        {!onboarding ? (
          <TopBar
            backLabel={backLabel || "Retour à la boutique"}
            screen={from || onboarding ? "Onboarding5" : "ShopProducer"}
            label={screenTitle || "GESTION\nDES STOCKS"}
            screenParams={{ onboarding: true }}
            navigationOverride={navigation}
            extraClasses="my-2"
          />
        ) : (
          <TextBody1 centered extraClasses="mt-5">
            Ajoutez au moins un produit
          </TextBody1>
        )}
      </View>

      <View className="px-3 mt-5" style={{ flex: 10 }}>
        <ScrollView>
          {isFetchLoading ? (
            <Spinner />
          ) : (
            <View className="">{openScreenButtons}</View>
          )}
        </ScrollView>
      </View>

      {onboarding && (
        <View className="px-3 mt-5" style={{ flex: 2 }}>
          <PrimaryButton
            label="Valider les produits"
            onPressFn={() =>
              (navigation as FromRootStack["navigation"]).navigate(
                "Onboarding5",
              )
            }
            disabled={!isStockSetted}
            extraClasses="h-20"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
