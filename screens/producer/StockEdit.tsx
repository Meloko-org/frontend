import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import * as FileSystem from "expo-file-system";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch } from "react-redux";
import { updateProduct, setProducts } from "../../reducers/shop";

import { SheetManager } from "react-native-actions-sheet";

import { TextInput, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import { ProductData, StockData, TagData } from "../../types/API";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import productsTools from "../../modules/productsTools";
import SecondaryButton from "../../components/utils/buttons/Secondary";
import TextBody1 from "../../components/utils/texts/Body1";
import { StocksState } from "../../reducers/stocks";
import { handleSheetFlow, showAlert } from "../../helpers/sheetHelpers";
import stocksTools from "../../modules/stocksTools";
import PrimaryButton from "../../components/utils/buttons/Primary";
import IconButton from "../../components/utils/buttons/Icon";
import SelectableTag from "../../components/utils/badges/SelectableTag";
import InputTextarea from "../../components/utils/inputs/Textarea";
import TextHeading3 from "../../components/utils/texts/Heading3";
import InputText from "../../components/utils/inputs/Text";
import ImageUploader from "../../components/utils/ImageUploader";

type StocksEditScreenRouteProp = RouteProp<RootStackParamList, "StocksEdit">;

type StocksEditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StocksEdit"
>;

type Props = {
  navigation: StocksEditScreenNavigationProp;
};

export default function StocksEditScreen({ navigation }: Props) {
  const route = useRoute<StocksEditScreenRouteProp>();
  const {
    from,
    backLabel,
    screenTitle,
    category,
    family,
    stockData,
    productData,
  } = route.params || {};

  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const [newProductMode, setNewProductMode] = useState<boolean>(false);
  const [isBulk, setBulk] = useState<boolean | undefined>(false);
  const [familyId, setFamilyId] = useState<string | undefined>();

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  // variables adapted
  const [nameAdapted, setNameAdapted] = useState<string>();
  const [familyAdpated, setFamilyAdpated] = useState<string>();
  const [imageAdapted, setImageAdapted] = useState<string>();

  const [productCustomName, setProductCustomName] = useState<
    string | undefined
  >("");
  const [weightPerUnit, setWeightPerUnit] = useState<string | undefined>("");
  const [price, setPrice] = useState<number | undefined>(0);
  const [stock, setStock] = useState<number | undefined>(0);
  const [description, setDescription] = useState<string | undefined>("");
  const [pricePerKilo, setPricePerKilo] = useState<number | undefined>(0);
  const [origin, setOrigin] = useState<string | undefined>("");
  const [format, setFormat] = useState<string | undefined>("");
  const [portion, setPortion] = useState<string | undefined>("");
  const [bestBeforeDate, setBestBeforeDate] = useState<string | undefined>("");
  const [image, setImage] = useState<string>();
  const [tags, setTags] = useState<TagData[] | undefined>([]);

  const [suggestedTags, setSuggestedTags] = useState<TagData[] | undefined>();
  const [remaingingTags, setRemainingTags] = useState<TagData[] | undefined>();

  const fetchSuggestedTags = async (familyId: string | undefined) => {
    const tagResponse = await stocksTools.getSuggestedTags(familyId);
    if (!tagResponse.success) {
      console.log("impossible de récupérer les tags suggérés.");
    }
    setSuggestedTags(tagResponse.data?.suggestedTags);
    setRemainingTags(tagResponse.data?.remainingTags);
  };

  useEffect(() => {
    if (!stockData && !productData) return;

    // const stock = props.payload?.stock;
    // const product = props.payload?.product;
    const family = stockData?.product.family ?? productData?.family;
    const bulk = family?.productsTypes.includes("bulk");

    setFamilyId(family?._id);
    setBulk(bulk);
    // setNewProductMode(!!product && !stock);

    fetchSuggestedTags(family?._id);

    if (productData) {
      // mode création

      if (bulk) {
        setPrice(0);
        setStock(0);
        setDescription("");
        setWeightPerUnit(
          productData.weight.measurement.$numberDecimal +
            " " +
            productData.weight.unit,
        );
        setNameAdapted(productData.name);
        setFamilyAdpated(productData.family.name);
        setImageAdapted(productData.image);
        setTags([]);
      } else {
        setPrice(0);
        setStock(0);
        setProductCustomName("");
        setPricePerKilo(0);
        setOrigin("");
        setFormat("");
        setPortion("");
        setBestBeforeDate("");
        setDescription("");
        setWeightPerUnit("");
        setImage("");
        setTags([]);
      }
    } else if (stockData) {
      // mode modification
      if (bulk) {
        setPrice(Number(stockData.price.$numberDecimal));
        setStock(Number(stockData.stock.$numberDecimal));
        setWeightPerUnit(
          stockData.product.weight.measurement.$numberDecimal +
            " " +
            stockData.product.weight.unit,
        );
        setTags(stockData.tags);
        setNameAdapted(stockData.product.name);
        setFamilyAdpated(stockData.product.family.name);
        setImageAdapted(stockData.product.image);
      } else {
        setPrice(Number(stockData.price.$numberDecimal));
        setStock(Number(stockData.stock.$numberDecimal));
        setProductCustomName(stockData.productCustomName);
        setPricePerKilo(Number(stockData.pricePerKilo.$numberDecimal));
        setOrigin(stockData.origin);
        setFormat(stockData.format);
        setPortion(stockData.portion);
        setBestBeforeDate(stockData.bestBeforeDate);
        setDescription(stockData.description);
        setWeightPerUnit(stockData.weightPerUnit);
        setImage(stockData.image);
      }
    }
  }, [stockData, productData]);

  const isTagSelected = (tagId: string) => {
    return tags?.some((t) => t._id === tagId);
  };

  const toggleTag = (tag: TagData) => {
    if (!tags) {
      setTags([tag]);
      return;
    }
    const isSelected = tags?.some((t) => t._id === tag._id);
    if (isSelected) {
      setTags(tags?.filter((t) => t._id !== tag._id));
    } else {
      setTags([...(tags ?? []), tag]);
    }
  };

  const handleQuantityChange = async (change: number) => {
    console.log("handle quantity :", change);
    let newStock = Number(stock) + change;

    if (newStock < 0) {
      newStock = 0;
    }

    setStock(newStock);
  };

  const handleSaveProduct = async () => {
    setSaveLoading(true);
    const token = await getToken();

    let values;
    if (isBulk) {
      if (newProductMode) {
        values = {
          product: productData,
          price,
          stock,
          description,
          tags,
        };
      } else {
        values = {
          _id: stockData?._id,
          product: stockData?.product,
          price,
          stock,
          description,
          tags,
        };
      }
    } else {
      if (newProductMode) {
        values = {
          product: productData,
          productCustomName,
          price,
          stock,
          pricePerKilo,
          weightPerUnit,
          origin,
          format,
          portion,
          bestBeforeDate,
          description,
          image,
          tags,
        };
      } else {
        values = {
          _id: stockData?._id,
          product: stockData?.product,
          productCustomName,
          price,
          stock,
          pricePerKilo,
          weightPerUnit,
          origin,
          format,
          portion,
          bestBeforeDate,
          description,
          image,
          tags,
        };
      }
    }

    let stockResponse;

    if (newProductMode) {
      stockResponse = await stocksTools.createStocks(token, values);
    } else {
      stockResponse = await stocksTools.updateStocks(token, values);
    }

    setSaveLoading(false);

    if (!stockResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: stockResponse.message!,
          alertType: "error",
        },
      });
    }

    dispatch(setProducts(stockResponse.data!));

    SheetManager.show("alert", {
      payload: {
        message: "Produit modifié.",
        alertType: "success",
      },
    });
  };

  const handleDeleteProduct = async (id: string) => {
    const canDelete = await SheetManager.show("confirm", {
      payload: {
        message: "Confirmez la suppression du produit:",
        alertType: "warning",
      },
    });

    if (canDelete) {
      const token = await getToken();
      const deleteResponse = await stocksTools.deleteStocks(token, id);

      if (!deleteResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: deleteResponse.message!,
            alertType: "error",
          },
        });
        return;
      }

      dispatch(setProducts(deleteResponse.data!));

      await handleSheetFlow({
        sheet: "alert",
        payload: {
          message: "Produit supprimé.",
          alertType: "success",
        },
        onAfter: async (action) => {
          navigation.navigate("Stocks", {
            backLabel: "Retour " + (stockData ? "au choix" : "aux catégories"),
            screenTitle: "STOCKS\n" + (family ? family : category),
            category: category!,
            family: family,
          });
        },
      });
    }
  };

  async function saveImageLocally(uri: string): Promise<string | null> {
    try {
      const directory = FileSystem.documentDirectory + "productImages/";

      // Crée le dossier s'il n'existe pas
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Génère un nouveau nom de fichier
      const extension = uri.split(".").pop();
      const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension || "jpg"}`;
      const newPath = directory + filename;

      // Copie le fichier dans ce dossier
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      return newPath;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l’image :", error);
      return null;
    }
  }

  const handleImageSelected = async (uri: string) => {
    const savedUri = await saveImageLocally(uri);
    if (savedUri) {
      console.log("image sauvée");
      setImage(savedUri);
    }
  };

  // console.log("------------------------------------ STOCKSADD")
  // console.log("from:", from);
  // console.log("backLabel:", backLabel);
  // console.log("screenTitle:", screenTitle);
  console.log("stockData:", stockData);
  console.log("productData :", productData);
  console.log("image sauvée: ", image);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour aux stocks"}
          screen={from || "StockCategories"}
          label={screenTitle || ""}
          screenParams={{
            category: category,
            family: family,
          }}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="bg-lightbg dark:bg-darkbg p-3">
            <View className="mb-3">
              {!isBulk ? (
                <View className="flex flex-row items-center">
                  <View className="flex-none w-1/4">
                    <View className="rounded-lg w-[90px] h-[90px]">
                      <ImageUploader
                        size={90}
                        defaultUri={stockData?.image}
                        onImageSelected={handleImageSelected}
                      />
                    </View>
                  </View>
                  <View className="grow w-3/4 pl-1">
                    <InputText
                      label="NOM DU PRODUIT"
                      placeholder="Saisissez le nom de votre produit"
                      value={productCustomName}
                      twoLines={true}
                      onChangeText={(value: string) =>
                        setProductCustomName(value)
                      }
                      extraClasses="h-[90px]"
                    />
                  </View>
                </View>
              ) : (
                <View className="flex flex-row">
                  <View className="flex-none">
                    <Image
                      source={
                        imageAdapted
                          ? { uri: imageAdapted }
                          : require("../../assets/icon.png")
                      }
                      className="rounded-xl w-20 h-20 mr-3"
                      alt={`Illustration du produit ${nameAdapted}`}
                      resizeMode="stretch"
                      width={96}
                      height={64}
                    />
                  </View>
                  <View className="flex flex-row grow">
                    <TextHeading3>
                      {familyAdpated + " " + nameAdapted}
                    </TextHeading3>
                  </View>
                </View>
              )}
            </View>

            <View className="flex flex-row items-center space-x-2 mb-1">
              <View className="flex-1">
                <TextBody1 extraClasses="font-bold">VENDU PAR</TextBody1>
              </View>
              {isBulk ? (
                <View className="flex flex-row justify-end w-36 mr-2">
                  <Text className="font-bold text-xl text-secondray dark:text-lightbg">
                    {weightPerUnit}
                  </Text>
                </View>
              ) : (
                <TextInput
                  className="bg-white rounded-lg w-36 text-right text-xl leading-5 pr-2"
                  value={weightPerUnit}
                  onChangeText={(value: string) => setWeightPerUnit(value)}
                />
              )}
            </View>

            <View className="flex flex-row items-center space-x-2 mb-1">
              <View className="flex-1">
                <TextBody1 extraClasses="font-bold">PRIX</TextBody1>
              </View>
              <View className="flex flex-row justify-end items-center mr-2">
                <TextInput
                  className="bg-white rounded-lg w-36 text-right text-xl leading-5 pr-2"
                  value={price?.toString() ?? ""}
                  onChangeText={(value: string) => setPrice(Number(value))}
                  keyboardType="numeric"
                />
                <Text className="font-bold text-xl text-secondary dark:text-lightbg ml-2">
                  €
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-center space-x-2 mb-1">
              <View className="flex-1">
                <TextBody1 extraClasses="font-bold">QUANTITÉ</TextBody1>
              </View>
              <View className="flex flex-row items-center justify-end w-48 my-3">
                <IconButton
                  iconName="minus"
                  iconColor="#ffffff"
                  extraClasses="bg-primary px-2 ml-2"
                  size={30}
                  onPressFn={() => handleQuantityChange(-1)}
                />
                <View className="flex flex-row justify-center w-24">
                  <TextInput
                    className="bg-white rounded-lg w-14 text-right text-xl leading-5 pr-2"
                    value={stock?.toString() ?? ""}
                    onChangeText={(value: string) => setStock(Number(value))}
                    keyboardType="numeric"
                  />
                </View>
                <IconButton
                  iconName="plus"
                  iconColor="#ffffff"
                  extraClasses="bg-primary px-2"
                  size={30}
                  onPressFn={() => handleQuantityChange(+1)}
                />
              </View>
            </View>

            <InputTextarea
              label="DESCRIPTION"
              placeholder="Saisir une description"
              value={description}
              onChangeText={(value: string) => setDescription(value)}
              extraClasses="mb-5"
            />

            {!isBulk && (
              <>
                <View className="flex flex-row items-center space-x-2 mb-1">
                  <View className="flex-1">
                    <TextBody1 extraClasses="font-bold">PRIX AU KILO</TextBody1>
                  </View>
                  <View className="flex flex-row justify-end items-center mr-2">
                    <TextInput
                      className="bg-white rounded-lg w-36 text-right text-xl leading-5 pr-2"
                      value={pricePerKilo?.toString() ?? ""}
                      onChangeText={(value: string) =>
                        setPricePerKilo(Number(value))
                      }
                      keyboardType="numeric"
                    />
                    <Text className="font-bold text-xl text-secondary dark:text-lightbg ml-2">
                      €
                    </Text>
                  </View>
                </View>

                <View className="flex flex-row items-center space-x-2 mb-1">
                  <View className="flex-1">
                    <TextBody1 extraClasses="font-bold">ORIGINE</TextBody1>
                  </View>
                  <TextInput
                    className="bg-white rounded-xl w-60 text-right text-xl leading-5 pr-2"
                    value={origin}
                    onChangeText={(value: string) => setOrigin(value)}
                  />
                </View>

                <View className="flex flex-row items-center space-x-2 mb-1">
                  <View className="flex-1">
                    <TextBody1 extraClasses="font-bold">FORMAT</TextBody1>
                  </View>
                  <TextInput
                    className="bg-white rounded-lg w-60 text-right text-xl leading-5 pr-2"
                    value={format}
                    onChangeText={(value: string) => setFormat(value)}
                  />
                </View>

                <View className="flex flex-row items-center space-x-2 mb-1">
                  <View className="flex-1">
                    <TextBody1 extraClasses="font-bold">PORTION</TextBody1>
                  </View>
                  <TextInput
                    className="bg-white rounded-lg w-60 text-right text-xl leading-5 pr-2"
                    value={portion}
                    onChangeText={(value: string) => setPortion(value)}
                  />
                </View>

                <View className="flex flex-row items-center space-x-2 mb-1">
                  <View className="flex-1">
                    <TextBody1 extraClasses="font-bold">{`DLC A\nRECEPTION`}</TextBody1>
                  </View>
                  <TextInput
                    className="bg-white rounded-lg w-60 text-right text-xl leading-5 pr-2"
                    value={bestBeforeDate}
                    onChangeText={(value: string) => setBestBeforeDate(value)}
                  />
                </View>
              </>
            )}

            <TextBody1 extraClasses="font-bold mt-5 mb-2">
              TAGS SUGGÉRÉS
            </TextBody1>
            <View className="flex flex-row flex-wrap">
              {suggestedTags?.map((tag) => (
                <SelectableTag
                  key={tag._id}
                  tag={tag}
                  onPressFn={() => toggleTag(tag)}
                  extraClasses="mr-2 mb-2"
                  selected={isTagSelected(tag._id)}
                />
              ))}
            </View>
            <TextBody1 extraClasses="font-bold mt-5 mb-2">
              TOUS LES TAGS
            </TextBody1>
            <View className="flex flex-row flex-wrap">
              {remaingingTags?.map((tag) => (
                <SelectableTag
                  key={tag._id}
                  tag={tag}
                  onPressFn={() => toggleTag(tag)}
                  extraClasses="mr-2 mb-2"
                  selected={isTagSelected(tag._id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="flex flex-row px-3 py-2 bg-lightbg dark:bg-darkbg">
          {!newProductMode && (
            <>
              <View className="w-1/6">
                <IconButton
                  iconName="trash"
                  iconFamily="FontAwesome5Icon"
                  iconColor="white"
                  onPressFn={() => handleDeleteProduct(stockData?._id!)}
                  size={25}
                  extraClasses="bg-danger h-14 mr-1"
                />
              </View>
              <View className="w-2/6">
                <SecondaryButton
                  label={`Dupliquer\nproduit`}
                  extraClasses="h-14 mr-1"
                  textClasses="text-sm"
                  onPressFn={() => {}}
                  disabled={false}
                  isLoading={false}
                />
              </View>
            </>
          )}

          <View
            className={`${newProductMode ? "flex flex-row justify-center w-full" : "w-3/6"}`}
          >
            <PrimaryButton
              label="Sauvegarder"
              disabled={isSaveLoading}
              onPressFn={handleSaveProduct}
              isLoading={isSaveLoading}
              extraClasses="h-14"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
