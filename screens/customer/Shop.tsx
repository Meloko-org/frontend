import { Image, View } from "react-native";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { ShopData, ProductData, StockData } from "../../types/API";
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
import ButtonBack from "../../components/utils/buttons/Back";
import ProductCategory from "../../components/cards/ProductCategory";
import CardNote from "../../components/cards/Note";
import BackLabelButton from "../../components/utils/buttons/BackLabel";
import { RouteProp, useRoute } from "@react-navigation/native";

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
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        onModalHide={() => setIsSearchResultsModalVisible(false)}
        style={{ margin: 0 }}
      >
        <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
          <View className="flex flex-row mb-5 mt-3">
            <BackLabelButton
              backLabel="Retour"
              onPressFn={() => setIsModalVisible(false)}
              extraClasses="ml-5 p-1"
            />
          </View>
          <TextHeading4 centered extraClasses="mb-1">
            Tous les produits
          </TextHeading4>
          <View className="flex-1 p-3">
            <ScrollView showsVerticalScrollIndicator={false} className="w-full">
              {categoryProducts}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {searchProduct.length > 0 && (
        <Modal
          isVisible={isSearchResultsModalVisible}
          coverScreen={false}
          onModalHide={() => setIsSearchResultsModalVisible(false)}
          style={{ margin: 0 }}
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

      <View className="flex flex-row mb-5 mt-3">
        <BackLabelButton
          backLabel="Retour aux résultats"
          onPressFn={() => navigation.goBack()}
          extraClasses="ml-5 pr-2"
        />
      </View>

      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="px-3">
          {shopData && (
            <View className="flex-1">
              <View>
                <View className="flex flex-row item-center justify-center">
                  <TextHeading2 extraClasses="w-min-auto bg-danger" centered>
                    {shopData.name}
                  </TextHeading2>

                  {shopData.isPremium && (
                    <FontAwesome5Icon
                      name="crown"
                      size={25}
                      color="#FAA200"
                      className=""
                      style={{ right: 20 }}
                    />
                  )}
                </View>

                <StarsNotation
                  iconNames={["star", "star-half", "star-o"]}
                  shopData={shopData}
                  extraClasses="mb-4"
                />

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
                  {isSignedIn && (
                    <View className="w-1/6 h-full">
                      <IconButton
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
                  <BadgeSecondary extraClasses="p-1" uppercase>
                    Click & collect
                  </BadgeSecondary>
                )}
                {shopData.markets.length > 0 && (
                  <BadgeSecondary extraClasses="p-1" uppercase>
                    Point de vente
                  </BadgeSecondary>
                )}
                {shopDistance && (
                  <BadgeSecondary extraClasses="p-1">{`${shopDistance} km`}</BadgeSecondary>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
