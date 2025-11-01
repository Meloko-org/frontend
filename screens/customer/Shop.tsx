import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import bookmarksTools from "../../modules/bookmarksTools";
import shopTools from "../../modules/shopTools";
import {
  ShopData,
  ProductData,
  StockData,
  ProductCategoryData,
  ProductCategoryCardData,
  CardProductData,
  CategoryData,
} from "../../types/API";
import { setIsShopSearchActive } from "../../reducers/mapShopResults";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, UserState } from "../../reducers/user";

import { SheetManager } from "react-native-actions-sheet";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image, View } from "react-native";
import StarsNotation from "../../components/utils/StarsNotation";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import TextBody1 from "../../components/utils/texts/Body1";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import IconButton from "../../components/utils/buttons/Icon";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CardProduct from "../../components/cards/Product";
import ProductCategory from "../../components/cards/ProductCategory";
import CardNote from "../../components/cards/Note";
import BackLabelButton from "../../components/utils/buttons/BackLabel";
import TextHeading3 from "../../components/utils/texts/Heading3";
import Spinner from "../../components/utils/Spinner";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

type ShopUserRouteProp = RouteProp<UserTabParamList, "ShopUser">;

type ShopUserNavProp = BottomTabNavigationProp<UserTabParamList, "ShopUser">;

type Props = {
  navigation: ShopUserNavProp;
  route: ShopUserRouteProp;
};

export default function ShopUserScreen({ navigation, route }: Props) {
  const { shopId, relevantProducts, distance, sheetId } = route.params;

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const { signOut, isSignedIn, getToken } = useAuth();

  const [shopData, setShopData] = useState<ShopData>(null);
  const [categoriesObjects, setCategoriesObjects] = useState<
    ProductCategoryCardData[]
  >([]);
  const [searchProducts, setSearchProducts] = useState<StockData[]>([]);
  const [shopDistance, setShopDistance] = useState<number | null>(null);

  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<
    StockData[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSearchResultsModalVisible, setIsSearchResultsModalVisible] =
    useState<boolean>(false);

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  // Shop recovery
  useEffect(() => {
    distance ? setShopDistance(Number(distance.toFixed(2))) : null;

    if (relevantProducts.length > 0) {
      setSearchProducts(relevantProducts);
    }

    (async () => {
      const fullShopResponse = await shopTools.getFullShopById(shopId);

      if (fullShopResponse.success && fullShopResponse.data) {
        setShopData(fullShopResponse.data.shop);
        setCategoriesObjects(fullShopResponse.data.categories);
      }
    })();

    // fetch(`${API_ROOT}/shops/${shopId}`)
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     if (data.result) {
    //       setShopData(data.shop);
    //     }
    //   });
  }, [route.params]);

  useEffect(() => {
    if (
      userStore.bookmarks &&
      shopData &&
      userStore.bookmarks.some((i) => i?._id === shopData._id)
    ) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [userStore, shopData, route.params]);

  const updateBookmarks = async () => {
    try {
      setIsBookmarking(true);
      const token = await getToken();

      const bookmarkResponse = await bookmarksTools.updateBookmarks(
        token,
        shopId,
      );

      if (!bookmarkResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: bookmarkResponse.message!,
            alertType: "error",
          },
        });
        return;
      }

      console.log(
        "SHOP :",
        JSON.stringify(bookmarkResponse.data?.bookmarks, null, 2),
      );

      setIsBookmarked(true);
      dispatch(updateUser(bookmarkResponse.data!));
      SheetManager.show("alert", {
        payload: {
          message: bookmarkResponse.message!,
          alertType: "success",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Sorting products from categories by clicking
  const handleCategoryClick = async (categoryName: string) => {
    const stocksResponse = await shopTools.getStocksByShopAndCategory(
      shopId,
      categoryName,
    );

    if (!stocksResponse.success) {
      console.warn(stocksResponse.message);
      return;
    }

    console.log("SHOPUSER: stocksResponse :", stocksResponse.data);

    setSelectedCategoryProducts(stocksResponse.data);
    setSelectedCategory(categoryName);
    setIsModalVisible(true);
  };

  const handleCategoryPress = (categoryId: string) => {
    const categoryObject = categoriesObjects.find(
      (obj) => obj.category._id === categoryId,
    );
    if (categoryObject) {
      setSelectedCategoryProducts(categoryObject.stocks);
      setSelectedCategory(categoryObject.category.name);
      setIsModalVisible(true);
    }
  };

  const topComments =
    shopData &&
    shopData.notes
      .filter((n) => n.comment)
      .map((c) => {
        return (
          <View key={c._id}>
            {c && <CardNote note={c} extraClasses="mr-2" />}
          </View>
        );
      });

  // Formatting category
  // const categories =
  //   shopData &&
  //   shopData.notes &&
  //   shopData.categories.map((category: ProductCategoryCardData) => {
  //     return (
  //       <ProductCategory
  //         category={category}
  //         onPressFn={() => handleCategoryClick(category.name)}
  //         key={category._id}
  //         extraClasses="mr-2"
  //       />
  //     );
  //   });

  const categories =
    categoriesObjects.length > 0 &&
    categoriesObjects.map((object: ProductCategoryCardData) => {
      return (
        <ProductCategory
          key={object.category._id}
          object={object}
          onPressFn={() => handleCategoryPress(object.category._id)}
          extraClasses="mr-2"
        />
      );
    });

  // Formatting search product
  const searchProduct = searchProducts?.map((stockData, i) => {
    return (
      <CardProduct
        stockData={stockData}
        shopData={shopData}
        key={stockData._id}
        extraClasses="mb-2"
        displayMode="shop"
        quantityControllable
        showImage
      />
    );
  });

  // Formatting shop product click (for the modal: Produits de la catégorie)
  const categoryProducts = selectedCategoryProducts.map((stockData) => {
    return (
      <CardProduct
        stockData={stockData}
        shopData={shopData}
        key={stockData._id}
        extraClasses="mb-1"
        displayMode="shop"
        quantityControllable
        showImage
      />
    );
  });

  // console.log("SHOPUSER: shopId :", shopId);
  // console.log("SHOPUSER shopData :", JSON.stringify(relevantProducts, null, 2))
  // console.log("SHOPUSER categoriesObjects :", categoriesObjects)

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex flex-row mb-2 mt-2">
        <BackLabelButton
          backLabel="Retour aux résultats"
          onPressFn={() => {
            if (sheetId) {
              dispatch(setIsShopSearchActive(true));
            }
            navigation.goBack();
          }}
          extraClasses="ml-3 pr-2"
        />
      </View>

      <View className="mb-5">
        <ScrollView showsVerticalScrollIndicator={false} className="px-3 mb-5">
          {shopData && (
            <View className="flex-1">
              <View>
                <View className="flex flex-row item-center justify-center">
                  <View className="flex flex-row items-center">
                    <TextHeading3 extraClasses="" centered>
                      {shopData.name}
                    </TextHeading3>

                    {shopData.isPremium && (
                      <FontAwesome5Icon
                        name="crown"
                        size={25}
                        color="#FAA200"
                        className=""
                        style={{ left: 5 }}
                      />
                    )}
                  </View>
                </View>

                <View className="flex flex-row justify-center">
                  <StarsNotation
                    iconNames={["star", "star-half", "star-o"]}
                    shopData={shopData}
                    extraClasses="mb-4"
                  />
                  {shopDistance && (
                    <TextBody1>{` - ${shopDistance} km`}</TextBody1>
                  )}
                </View>

                <View className="flex flex-row items-center mb-2">
                  <View className="w-2/6">
                    <Image
                      source={
                        shopData?.logo
                          ? { uri: shopData?.logo }
                          : require("../../assets/icon.png")
                      }
                      className="rounded-lg border border-primary w-24 h-24"
                      alt={`photo du point de vente ${shopData?.name}`}
                      resizeMode="cover"
                      width={112}
                      height={112}
                    />
                  </View>

                  <View
                    className={`w-3/6 flex flex-row justify-start pr-1 h-full`}
                  >
                    <TextBody1>{shopData.shortDesc}</TextBody1>
                  </View>

                  <View className="w-1/6 flex flex-column justify-center">
                    {isSignedIn && (
                      <IconButton
                        iconName={isBookmarked ? "heart" : "heart-o"}
                        iconFamily="FontAwesomeIcon"
                        iconColor="#98B66E"
                        extraClasses="h-10"
                        onPressFn={updateBookmarks}
                      />
                    )}
                    <IconButton
                      iconName="eye"
                      iconFamily="FontAwesome5Icon"
                      buttonColor="bg-primary"
                      extraClasses="h-10"
                      onPressFn={() => {
                        SheetManager.show("shop-details", {
                          payload: {
                            shop: shopData,
                            showButtons: false,
                          },
                        });
                      }}
                    />
                  </View>
                </View>
              </View>

              <View className="flex flex-row w-full justify-evenly mb-3">
                {shopData.clickCollect && (
                  <BadgeSecondary
                    extraClasses="p-1"
                    textClasses="text-xs"
                    uppercase
                  >
                    Click & collect
                  </BadgeSecondary>
                )}
                {shopData.markets.length > 0 && (
                  <BadgeSecondary
                    extraClasses="p-1"
                    textClasses="text-xs"
                    uppercase
                  >
                    Point de vente
                  </BadgeSecondary>
                )}
                {/* ajouter la livraison */}
              </View>
            </View>
          )}

          {/* {topComments && (
            <View className="mb-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
              >
                <View className="p-2 flex flex-row">{topComments}</View>
              </ScrollView>
            </View>
          )} */}

          {searchProduct.length > 0 && (
            <View className="mt-5">
              <TextHeading3 centered>Votre recherche</TextHeading3>
              <View className="my-3">{searchProduct.slice(0, 4)}</View>
              <ButtonPrimaryEnd
                label={`Tous les résultats (${searchProduct.length})`}
                iconName="arrow-right"
                extraClasses="h-14 mb-5"
                onPressFn={() => setIsSearchResultsModalVisible(true)}
              />
            </View>
          )}

          <View className="my-5">
            <TextHeading3 centered extraClasses="w-full">
              Rayons
            </TextHeading3>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="p-2 flex flex-row">{categories}</View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Modal Résultats de recherche */}
      {searchProduct.length > 0 && (
        <Modal
          isVisible={isSearchResultsModalVisible}
          coverScreen={false}
          onModalHide={() => setIsSearchResultsModalVisible(false)}
          style={{ margin: 0 }}
        >
          <SafeAreaView
            className="bg-lightbg flex-1 dark:bg-darkbg"
            edges={["right", "left", "top"]}
          >
            <View
              style={{ flex: 1 }}
              className="flex flex-row justify-between items-center"
            >
              <BackLabelButton
                backLabel="Retour"
                onPressFn={() => setIsSearchResultsModalVisible(false)}
                extraClasses="ml-3 pr-2"
              />
              <View className="grow">
                <TextHeading3 centered extraClasses="">
                  Tous les produits
                </TextHeading3>
              </View>
            </View>

            <View style={{ flex: 10 }} className="px-3 py-1">
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="w-full"
              >
                {searchProduct}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      )}

      {/* Modal Produits de la catégorie */}
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        onModalHide={() => {
          setIsModalVisible(false);
          setSelectedCategory(null);
        }}
        style={{ margin: 0 }}
      >
        <SafeAreaView
          className="bg-lightbg flex-1 dark:bg-darkbg"
          edges={["right", "left", "top"]}
        >
          <View
            style={{ flex: 1 }}
            className="flex flex-row justify-between items-center"
          >
            <BackLabelButton
              backLabel="Retour"
              onPressFn={() => setIsModalVisible(false)}
              extraClasses="ml-3 pr-2"
            />
            <View className="mr-3 flex flex-row items-center">
              <TextBody1>Produits du rayon: </TextBody1>
              <TextHeading3 extraClasses="">{selectedCategory}</TextHeading3>
            </View>
          </View>

          {/* <TextHeading4 centered extraClasses="mb-1">
            Tous les produits
          </TextHeading4> */}
          <View style={{ flex: 10 }} className="px-3 py-1">
            <ScrollView showsVerticalScrollIndicator={false} className="w-full">
              {categoryProducts}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {isBookmarking && (
        <View className="absolute top-0 w-full h-full flex items-center justify-center bg-darkbg/80 mt-[39px]">
          <Spinner />
        </View>
      )}
    </SafeAreaView>
  );
}
