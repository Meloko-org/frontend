import { Image, View } from "react-native";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import {
  ShopData,
  ProductData,
  StockData,
  ProductCategoryData,
} from "../../types/API";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, UserState } from "../../reducers/user";
import { useAuth } from "@clerk/clerk-expo";

import StarsNotation from "../../components/utils/StarsNotation";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextBody1 from "../../components/utils/texts/Body1";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import IconButton from "../../components/utils/buttons/Icon";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CardProduct from "../../components/cards/Product";
import ProductCategory from "../../components/cards/ProductCategory";
import CardNote from "../../components/cards/Note";
import BackLabelButton from "../../components/utils/buttons/BackLabel";
import { RouteProp, useRoute } from "@react-navigation/native";
import TextHeading3 from "../../components/utils/texts/Heading3";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

type ShopUserScreenRouteProp = RouteProp<RootStackParamList, "ShopUser">;

type ShopUserScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopUser"
>;

type Props = {
  navigation: ShopUserScreenNavigationProp;
};

export default function ShopUserScreen({ navigation }: Props) {
  const route = useRoute<ShopUserScreenRouteProp>();
  const { shopId, relevantProducts, distance, sheetId } = route.params;

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const { signOut, isSignedIn, getToken } = useAuth();

  const [shopData, setShopData] = useState<ShopData>(null);
  const [searchProducts, setSearchProducts] = useState<StockData[]>([]);
  const [shopDistance, setShopDistance] = useState<number | null>(null);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<
    StockData[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSearchResultsModalVisible, setIsSearchResultsModalVisible] =
    useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Shop recovery
  useEffect(() => {
    distance ? setShopDistance(Number(distance.toFixed(2))) : null;

    if (relevantProducts.length > 0) {
      setSearchProducts(relevantProducts);
    }

    fetch(`${API_ROOT}/shops/${shopId}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.result) {
          setShopData(data.shop);
        }
      });
  }, [route.params]);

  useEffect(() => {
    if (
      userStore.bookmarks &&
      shopData &&
      userStore.bookmarks.some((i) => i._id === shopData._id)
    ) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [userStore, shopData, route.params]);

  const handleBookmarkPress = async (): Promise<void> => {
    isBookmarked ? removeFromBookmark() : addToBookmark();
  };

  const addToBookmark = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_ROOT}/users/bookmarks/${shopData?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
        },
      );
      const data = await response.json();
      setIsBookmarked(true);
      dispatch(updateUser(data.user));
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromBookmark = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_ROOT}/users/bookmarks/${shopData?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
        },
      );
      const data = await response.json();
      setIsBookmarked(false);
      dispatch(updateUser(data.user));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllResultsPress = async (): Promise<void> => {
    // setIsSearchResultsModalVisible(true);
    setIsModalVisible(true);
  };

  // Sorting products from categories by clicking
  const handleCategoryClick = (categoryName: string) => {
    const categoryData =
      shopData &&
      shopData.categories.find(
        (category: ProductCategoryData) => category.name === categoryName,
      );
    const filteredProducts = categoryData ? categoryData.products : [];
    setSelectedCategoryProducts(filteredProducts);
    setSelectedCategory(categoryName);
    setIsModalVisible(true);
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
  const categories =
    shopData &&
    shopData.notes &&
    shopData.categories.map((category: ProductCategoryData) => {
      return (
        <ProductCategory
          category={category}
          onPressFn={() => handleCategoryClick(category.name)}
          key={category._id}
          extraClasses="mr-2"
        />
      );
    });

  // Formatting search product
  const searchProduct = searchProducts.map((stockData, i) => {
    return (
      <CardProduct
        stockData={stockData}
        key={stockData._id}
        extraClasses="mb-1"
        displayMode="shop"
        quantityControllable
        showImage
      />
    );
  });

  // Formatting shop product click
  const categoryProducts = selectedCategoryProducts.map((stockData) => {
    return (
      <CardProduct
        stockData={stockData}
        key={stockData._id}
        extraClasses="mb-1"
        displayMode="shop"
        quantityControllable
        showImage
      />
    );
  });

  console.log("shopData :", shopData);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex flex-row mb-2 mt-2">
        <BackLabelButton
          backLabel="Retour aux résultats"
          onPressFn={() => navigation.goBack()}
          extraClasses="ml-3 pr-2"
        />
      </View>

      <View className="">
        <ScrollView showsVerticalScrollIndicator={false} className="px-3">
          {shopData && (
            <View className="flex-1">
              <View>
                <View className="flex flex-row item-center justify-center">
                  <View className="flex flex-row items-center">
                    <TextHeading2 extraClasses="" centered>
                      {shopData.name}
                    </TextHeading2>

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

                <View className="flex flex-row items-center mb-3">
                  <View className="w-2/6 h-full">
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
                    className={`${isSignedIn ? "w-3/6" : "w-4/6"} flex flex-row justify-start h-full pr-1`}
                  >
                    <TextBody1>{shopData.description}</TextBody1>
                  </View>

                  <View className="w-1/6 h-full">
                    {isSignedIn && (
                      <IconButton
                        iconName={isBookmarked ? "heart" : "heart-o"}
                        iconFamily="FontAwesomeIcon"
                        iconColor="#98B66E"
                        extraClasses="h-10"
                        onPressFn={handleBookmarkPress}
                      />
                    )}
                    <IconButton
                      iconName="eye"
                      iconFamily="FontAwesome5Icon"
                      buttonColor="bg-primary"
                      extraClasses="h-10"
                      onPressFn={() => {}}
                    />
                  </View>
                </View>
              </View>

              <View className="flex flex-row w-full justify-evenly mb-3">
                {shopData.clickCollect && (
                  <BadgeSecondary extraClasses="p-1" uppercase>
                    Click & collect
                  </BadgeSecondary>
                )}
                {shopData.markets.length > 0 && (
                  <BadgeSecondary extraClasses="p-1" uppercase>
                    Point de vente
                  </BadgeSecondary>
                )}
                {/* ajouter la livraison */}
              </View>
            </View>
          )}

          {topComments && (
            <View className="mb-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  "my-3 flex flex-row justify-start items-center",
                ]}
              >
                <View className="p-2 flex flex-row">{topComments}</View>
              </ScrollView>
            </View>
          )}

          {searchProduct.length > 0 && (
            <View>
              <TextHeading3 centered>Votre recherche</TextHeading3>
              <View className="my-3">{searchProduct.slice(0, 4)}</View>
              <ButtonPrimaryEnd
                label={`Tous les résultats (${searchProduct.length})`}
                iconName="arrow-right"
                extraClasses="h-14"
                onPressFn={() => setIsSearchResultsModalVisible(true)}
              />
            </View>
          )}

          <View className="mt-5">
            <TextHeading3 centered extraClasses="w-full">
              Rayons
            </TextHeading3>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                "my-3 flex flex-row justify-start items-center",
              ]}
            >
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
          <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
            <View className="flex flex-row justify-between items-center">
              <BackLabelButton
                backLabel="Retour"
                onPressFn={() => setIsSearchResultsModalVisible(false)}
                extraClasses="ml-3 pr-2"
              />
              <View className="grow">
                <TextHeading3 centered extraClasses="">
                  Tous vos résultats
                </TextHeading3>
              </View>
            </View>

            <View className="p-3">
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
        <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
          <View className="flex flex-row justify-between items-center">
            <BackLabelButton
              backLabel="Retour"
              onPressFn={() => setIsModalVisible(false)}
              extraClasses="ml-3 pr-2"
            />
            <View className="mr-3">
              <TextHeading3 extraClasses="">{selectedCategory}</TextHeading3>
            </View>
          </View>

          <TextHeading4 centered extraClasses="mb-1">
            Tous les produits
          </TextHeading4>
          <View className="p-3">
            <ScrollView showsVerticalScrollIndicator={false} className="w-full">
              {categoryProducts}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
