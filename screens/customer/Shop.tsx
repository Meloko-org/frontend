import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { ShopData, ProductData, StockData } from "../../types/API";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../reducers/user";
import { useAuth } from "@clerk/clerk-expo";

import StarsNotation from "../../components/utils/StarsNotation";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextBody1 from "../../components/utils/texts/Body1";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import ButtonIcon from "../../components/utils/buttons/Icon";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CardProduct from "../../components/cards/Product";
import ButtonBack from "../../components/utils/buttons/Back";
import ProductCategory from "../../components/cards/ProductCategory";
import CardNote from "../../components/cards/Note";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopUser"
>;

type Props = {
  navigation: StocksScreenNavigationProp;
  route: Route;
};

type Params = {
  params: {
    shopId: string;
    relevantProducts: ProductData[];
  };
};

type Route = {
  params: Params;
};

export default function ShopUserScreen({ route, navigation }: Props) {
  const dispatch = useDispatch();
  const userStore = useSelector((state: { user }) => state.user.value);
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
  // Shop recovery
  useEffect(() => {
    const { shopId, relevantProducts, distance }: Route = route.params;
    distance ? setShopDistance(distance.toFixed(2)) : null;

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
        `${API_ROOT}/users/bookmarks/${shopData._id}`,
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
        `${API_ROOT}/users/bookmarks/${shopData._id}`,
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
    setIsSearchResultsModalVisible(true);
  };

  // Sorting products from categories by clicking
  const handleCategoryClick = (categoryName: string) => {
    const categoryData =
      shopData &&
      shopData.categories.find((category) => category.name === categoryName);
    const filteredProducts = categoryData ? categoryData.products : [];
    setSelectedCategoryProducts(filteredProducts);
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
    shopData.categories.map((category) => {
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

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="p-3">
          {shopData && (
            <View className="flex-1">
              <View>
                <TextHeading2>{shopData.name}</TextHeading2>
                <StarsNotation
                  iconNames={["star", "star-half", "star-o"]}
                  shopData={shopData}
                  extraClasses="mb-4"
                />

                <View className="flex flex-row items-center mb-3">
                  <View className="w-2/6 h-full">
                    {shopData.logo ? (
                      <Image
                        source={{ uri: shopData.logo }}
                        resizeMode="cover"
                        width={112}
                        height={112}
                        className="rounded-full border border-primary"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/icon.png")}
                        resizeMode="cover"
                        width={112}
                        height={112}
                        className="w-28 h-28 rounded-full border border-primary"
                      />
                    )}
                  </View>
                  <View
                    className={`${isSignedIn ? "w-3/6" : "w-4/6"} flex flex-row justify-start h-full pr-1`}
                  >
                    <TextBody1>{shopData.description}</TextBody1>
                  </View>
                  {isSignedIn && (
                    <View className="w-1/6 h-full">
                      <ButtonIcon
                        iconName={isBookmarked ? "heart" : "heart-o"}
                        extraClasses="h-16"
                        onPressFn={handleBookmarkPress}
                      />
                    </View>
                  )}
                </View>
              </View>

              <View className="flex flex-row w-full justify-evenly mb-3">
                {shopData.clickCollect && (
                  <BadgeSecondary uppercase>Click & collect</BadgeSecondary>
                )}
                {shopData.markets.length > 0 && (
                  <BadgeSecondary uppercase>Marché local</BadgeSecondary>
                )}
                {shopDistance && (
                  <BadgeSecondary>{`${shopDistance}km`}</BadgeSecondary>
                )}
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
              <TextHeading2>Votre recherche</TextHeading2>
              <View className="my-4">{searchProduct.slice(0, 4)}</View>
              <ButtonPrimaryEnd
                label={`Tous les résultats (${searchProduct.length})`}
                iconName="arrow-right"
                onPressFn={handleAllResultsPress}
              ></ButtonPrimaryEnd>
            </View>
          )}

          <View className="my-3">
            <TextHeading2>Rayons</TextHeading2>
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

          <Modal
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
              <View className="p-3">
                <ButtonBack onPressFn={() => setIsModalVisible(false)} />

                <TextHeading2 extraClasses="mb-4">
                  Tous les produits
                </TextHeading2>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="w-full"
                >
                  {categoryProducts}
                </ScrollView>
              </View>
            </SafeAreaView>
          </Modal>
          {searchProduct.length > 0 && (
            <Modal
              visible={isSearchResultsModalVisible}
              animationType="slide"
              onRequestClose={() => setIsSearchResultsModalVisible(false)}
            >
              <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
                <View className="p-3">
                  <ButtonBack
                    onPressFn={() => setIsSearchResultsModalVisible(false)}
                  />

                  <TextHeading2 extraClasses="mb-4">
                    Tous vos résultats
                  </TextHeading2>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
