import React, { useState, useEffect, useRef } from "react";
import { useSelector, UseSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import { ShopState } from "../reducers/shop";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { StockData } from "../types/API";
import stocksTools from "../modules/stocksTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View, TextInput, Alert, Image } from "react-native";
import TextHeading3 from "../components/utils/texts/Heading3";
import TextHeading4 from "../components/utils/texts/Heading4";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import BackLabelButton from "../components/utils/buttons/BackLabel";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import ButtonIcon from "../components/utils/buttons/Icon";
import TextBody1 from "../components/utils/texts/Body1";
import AddProductModal from "../components/modals/producer/AddProduct";
import Spinner from "../components/utils/Spinner";

const FontAwesome = _Fontawesome as React.ElementType;

// Navigation type
type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigatorProducer"
>;

type Props = {
  navigation: StocksScreenNavigationProp;
};

export default function StocksScreen({ navigation }: Props) {
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const { getToken } = useAuth();

  const [isSaveLoading, setSaveLoading] = useState<Boolean>(false);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [shouldSave, setShouldSave] = useState<Boolean>(false);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [tempPrices, setTempPrices] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<string[]>([]);

  const [isAddProductModalVisible, setAddProductModalVisible] =
    useState<boolean>(false);

  const [isOpen, setIsOpen] = useState({});

  const [shopId, setShopId] = useState<string | undefined>(shopStore?._id);

  useFocusEffect(
    React.useCallback(() => {
      fetchStocks();
    }, []),
  );

  const fetchStocks = async () => {
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
      setIsFetchLoading(false);
    }
  };

  const refreshStocks = async () => {
    setAddProductModalVisible(false);
    fetchStocks();
    setIsOpen({});
  };

  useEffect(() => {
    if (!isFetchLoading && stocks.length > 0) {
      const categoriesList: string[] = Array.from(
        new Set(stocks?.map((stock) => stock?.product.family.category.name)),
      );
      setCategories(categoriesList);
    }
  }, [isFetchLoading]);

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

        if ("message" in data) {
          Alert.alert("Echec de la mise à jour", data.message);
          setSaveLoading(false);
        } else {
          console.log("les datas:", data);
          Alert.alert("Message", "Mise à jour des stocks réussie");
          setSaveLoading(false);
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
    setSaveLoading(true);
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: tempPrices[stock._id] ?? stock.price,
      })),
    );
    setShouldSave(true);
  };

  const totalProducts = stocks?.length.toString();

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex flex-row mb-5 mt-3">
        <BackLabelButton
          onPressFn={() =>
            navigation.navigate("TabNavigatorProducer", {
              screen: "Shop",
            })
          }
          extraClasses="ml-5 p-1"
        >
          Retour à la boutique
        </BackLabelButton>
      </View>

      <View>
        <TextHeading3 centered extraClasses="mb-5">
          Mes Stocks ({totalProducts})
        </TextHeading3>
      </View>

      {isFetchLoading ? (
        <Spinner />
      ) : (
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
                                      : "la pièce"}
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
                  disabled={isSaveLoading}
                  extraClasses="my-3"
                  onPressFn={() => handlePrepareSaveStock()}
                  isLoading={isSaveLoading}
                />
              )}
              <ButtonPrimaryEnd
                label="Ajouter des produits"
                iconName="plus"
                extraClasses="mt-5 mb-5"
                onPressFn={() => setAddProductModalVisible(true)}
              />
            </View>
          </ScrollView>
        </View>
      )}

      <AddProductModal
        isVisible={isAddProductModalVisible}
        onCloseFn={() => setAddProductModalVisible(false)}
        afterAddProducts={refreshStocks}
      />
    </SafeAreaView>
  );
}
