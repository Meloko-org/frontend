import React, { useState, useEffect, useRef } from "react";
import { useSelector, UseSelector } from "react-redux";
import { ShopState } from "../reducers/shop";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { useAuth } from "@clerk/clerk-expo";

import { StockData } from "../types/API";
import stocksTools from "../modules/stocksTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import TextHeading3 from "../components/utils/texts/Heading3";
import TextHeading4 from "../components/utils/texts/Heading4";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import InputText from "../components/utils/inputs/Text";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import categoriesTools from "../modules/categoriesTools";
import ButtonIcon from "../components/utils/buttons/Icon";
import TextBody1 from "../components/utils/texts/Body1";
import TextBody2 from "../components/utils/texts/Body2";
import AddProductModal from "../components/modals/producer/AddProduct";

const FontAwesome = _Fontawesome as React.ElementType;

// Navigation type
type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GestionDesStocks"
>;

type Props = {
  navigation: StocksScreenNavigationProp;
};

export default function StocksScreen({ navigation }: Props) {
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const { getToken } = useAuth();

  const [isStockSaveLoading, setStockSaveLoading] = useState<Boolean>(false);
  const [isLoadingStocks, setIsLoadingStocks] = useState<Boolean>(true);
  const [shouldSave, setShouldSave] = useState<Boolean>(false);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [tempPrices, setTempPrices] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isAddProductModalVisible, setAddProductModalVisible] =
    useState<boolean>(false);

  const [isOpen, setIsOpen] = useState({});

  // const [shopId, setShopId] = useState<string>("66b339729a76167d3a93df3b");
  const [shopId, setShopId] = useState<string | undefined>(shopStore?._id);

  useEffect(() => {
    getStocksByShop();
  }, []);

  const getStocksByShop = async () => {
    const data = await stocksTools.getStocksByShop(shopId);
    if (data) {
      const formattedData = data.map((item: StockData) => ({
        _id: item?._id,
        price: parseFloat(item.price.$numberDecimal),
        stock: parseInt(item.stock.$numberDecimal, 10),
        shop: item?.shop, // en supposant que shop est déjà formaté selon ShopData
        product: item?.product, // en supposant que product est formaté selon ProductData
        tags: item?.tags, // en supposant que les tags correspondent déjà à TagData[]
      }));
      setStocks(formattedData);
      setIsLoadingStocks(false);
    }
  };

  const refreshStocks = async () => {
    setAddProductModalVisible(false);
    getStocksByShop();
    setIsOpen({});
  };

  useEffect(() => {
    if (!isLoadingStocks && stocks.length > 0) {
      const categoriesList: string[] = Array.from(
        new Set(stocks?.map((stock) => stock?.product.family.category.name)),
      );
      setCategories(categoriesList);
    }
  }, [isLoadingStocks]);

  useEffect(() => {
    if (categories.length > 1) {
      setIsOpen(
        categories.reduce(
          (acc, category) => ({ ...acc, [category]: false }),
          {},
        ),
      );
    }
  }, [categories]);

  useEffect(() => {
    (async () => {
      if (shouldSave) {
        console.log("data à envoyer :", stocks);
        // envoi des données au serveur
        const token = await getToken();

        const data = await stocksTools.updateStocks(token, stocks);

        if (data.error) {
          Alert.alert("Message", data.error);
          setStockSaveLoading(false);
        }
        if (data) {
          console.log("les datas:", data);
          Alert.alert("Message", "Mise à jour des stocks réussie");
          setStockSaveLoading(false);
        }
        setShouldSave(false);
      }
    })();
  }, [shouldSave]);

  const toggleOpenList = (category: string) => {
    setIsOpen((prevState: string[]) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleChangePrice = (id: string | undefined, price: string) => {
    setTempPrices((prevPrices) => ({
      ...prevPrices,
      [id || ""]: price,
    }));
  };

  const handleQuantityChange = async (id: string, change: number) => {
    const stockToUpdate = stocks?.find((stock) => stock._id === id);
    if (!stockToUpdate) return;

    const newStock = Number(stockToUpdate.stock) + change;

    setStocks((prevStocks) =>
      prevStocks?.map((stock: StockData) =>
        stock?._id === id ? { ...stock, stock: newStock } : stock,
      ),
    );
  };

  const handlePrepareSaveStock = async () => {
    // mise à jour des prix en fonction de tempPrices
    setStockSaveLoading(true);
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: tempPrices[stock._id] ?? stock.price,
      })),
    );
    setShouldSave(true);
  };

  const totalProducts = stocks?.length.toString();

  console.log(stocks);
  console.log(tempPrices);
  // console.log(filteredStocks.map((stock) => ({
  // 	stock: stock?.stock,
  // 	price: stock?.price
  // })))
  console.log("categories :", categories);
  console.log("isOpen :", isOpen);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="mt-5 ml-5">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TabNavigatorProducer", {
              screen: "Boutique",
            })
          }
          className="flex-none"
        >
          <FontAwesome name="arrow-left" size={25} color="#98B66E" />
        </TouchableOpacity>
      </View>

      <View>
        <TextHeading3 centered extraClasses="mb-5">
          Mes Stocks ({totalProducts})
        </TextHeading3>
      </View>

      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="p-3">
          <View className="">
            {stocks.length === 0 ? (
              <TextBody1>Aucun stock trouvé pour ce magasin.</TextBody1>
            ) : (
              Array.isArray(categories) &&
              categories.map((category: string) => (
                <View key={category}>
                  <View className="flex-row items-center mb-3">
                    <FontAwesome
                      name="square"
                      className="text-secondary dark:text-primary text-lg mr-2"
                    />
                    <TextHeading4 extraClasses="flex-shrink">
                      {category.toUpperCase()} (
                      {
                        stocks?.filter(
                          (s) => s.product.family.category.name === category,
                        ).length
                      }
                      )
                    </TextHeading4>
                    <ButtonIcon
                      iconName="arrow-down"
                      extraClasses="p-3 bg-primary"
                      onPressFn={() => toggleOpenList(category)}
                      animated={true}
                    />
                  </View>
                  {isOpen[category] &&
                    Array.isArray(stocks) &&
                    stocks
                      .filter(
                        (stock: StockData) =>
                          stock?.product.family.category.name === category,
                      )
                      .map((stock: StockData) => (
                        <View
                          key={stock?._id}
                          className="rounded-lg bg-lightbg dark:bg-tertiary p-3 mb-3 "
                        >
                          <View className="flex flex-row items-center">
                            <View className="rounded-lg">
                              <Image
                                source={
                                  stock?.product.image
                                    ? { uri: stock.product.image }
                                    : require("../assets/icon.png")
                                }
                                className="rounded-xl w-20 h-20 mr-3"
                                alt={`Illustration du produit ${stock?.product.name}`}
                                resizeMode="stretch"
                                width={96}
                                height={64}
                              />
                            </View>
                            <View>
                              <TextBody1 extraClasses="font-bold mb-1">
                                {stock?.product.family.name}{" "}
                                {stock?.product.name}
                              </TextBody1>

                              <View className="flex flex-row items-center my-1">
                                <TextBody1>Prix</TextBody1>
                                <TextInput
                                  value={
                                    tempPrices[stock?._id || ""] ??
                                    stock?.price?.toString() ??
                                    ""
                                  }
                                  onChangeText={(price) =>
                                    handleChangePrice(stock?._id, price)
                                  }
                                  keyboardType={"numeric"}
                                  className="rounded-sm bg-white text-black mx-3 px-4 font-bold text-lg"
                                />
                                <TextBody1>
                                  euros
                                  {stock.product.weight.unit === "gr"
                                    ? "/kg"
                                    : " à la pièce"}
                                </TextBody1>
                              </View>

                              <View className="flex flex-row items-center mt-1">
                                <TextBody1>Quantité</TextBody1>
                                <ButtonIcon
                                  iconName="minus"
                                  extraClasses="bg-primary px-2 ml-2"
                                  size={20}
                                  onPressFn={() =>
                                    handleQuantityChange(stock?._id, -1)
                                  }
                                />
                                <View>
                                  <TextHeading4 extraClasses="mx-2">
                                    {stock.stock ? stock.stock : 0}
                                  </TextHeading4>
                                </View>
                                <ButtonIcon
                                  iconName="plus"
                                  extraClasses="bg-primary px-2"
                                  size={20}
                                  onPressFn={() =>
                                    handleQuantityChange(stock?._id, +1)
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                </View>
              ))
            )}
            {stocks.length > 0 && (
              <ButtonPrimaryEnd
                label="Sauvegarder"
                iconName="refresh"
                disabled={isStockSaveLoading}
                extraClasses="my-3"
                onPressFn={() => handlePrepareSaveStock()}
                isLoading={isStockSaveLoading}
              />
            )}
            <ButtonPrimaryEnd
              label="Ajouter des produits"
              iconName="plus"
              extraClasses="mt-5"
              onPressFn={() => setAddProductModalVisible(true)}
            />
          </View>
        </ScrollView>
      </View>

      <AddProductModal
        isVisible={isAddProductModalVisible}
        onCloseFn={() => setAddProductModalVisible(false)}
        afterAddProducts={refreshStocks}
      />
    </SafeAreaView>
  );
}
