import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import ActionSheet, {
  SheetProps,
  ScrollView,
  SheetManager,
} from "react-native-actions-sheet";

import { useDispatch } from "react-redux";
import { updateProduct, setProducts } from "../../reducers/shop";

import { View, Text, Image, TextInput } from "react-native";
import InputText from "../utils/inputs/Text";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";
import InputTextarea from "../utils/inputs/Textarea";
import TextBody1 from "../utils/texts/Body1";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import ButtonSecondaryEnd from "../utils/buttons/SecondaryEnd";
import SecondaryButton from "../utils/buttons/Secondary";
import PrimaryButton from "../utils/buttons/Primary";
import IconButton from "../utils/buttons/Icon";
import { StockData, TagData } from "../../types/API";
import SelectableTag from "../utils/badges/SelectableTag";
import Product from "../cards/Products";
import stocksTools from "../../modules/stocksTools";
import { useFocusEffect } from "@react-navigation/native";

export default function EditProductSheet(props: SheetProps<"edit-product">) {
  console.log(
    "payload reçu dans EditProductSheet :",
    JSON.stringify(props.payload, null, 2),
  );
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
    if (!props.payload) return;

    const stock = props.payload?.stock;
    const product = props.payload?.product;
    const family = stock?.product.family ?? product?.family;
    const bulk = family?.productsTypes.includes("bulk");

    setFamilyId(family?._id);
    setBulk(bulk);
    setNewProductMode(!!product && !stock);

    fetchSuggestedTags(family?._id);

    if (!!product && !stock) {
      // mode création
      if (bulk) {
        setWeightPerUnit(
          product.weight.measurement.$numberDecimal + " " + product.weight.unit,
        );
        setNameAdapted(product.name);
        setFamilyAdpated(product.family.name);
        setImageAdapted(product.image);
      } else {
        // ...
      }
    } else if (stock) {
      // mode modification
      if (bulk) {
        setPrice(Number(stock.price.$numberDecimal));
        setStock(Number(stock.stock.$numberDecimal));
        setWeightPerUnit(
          stock.product.weight.measurement.$numberDecimal +
            " " +
            stock.product.weight.unit,
        );
        setTags(stock.tags);
        setNameAdapted(stock.product.name);
        setFamilyAdpated(stock.product.family.name);
        setImageAdapted(stock.product.image);
      } else {
        setPrice(Number(stock.price.$numberDecimal));
        setStock(Number(stock.stock.$numberDecimal));
        setProductCustomName(stock.productCustomName);
        setPricePerKilo(Number(stock.pricePerKilo.$numberDecimal));
        setOrigin(stock.origin);
        setFormat(stock.format);
        setPortion(stock.portion);
        setBestBeforeDate(stock.bestBeforeDate);
        setDescription(stock.description);
        setWeightPerUnit(stock.weightPerUnit);
        setImage(stock.image);
      }
    }
  }, [props.payload]);

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
          product: props.payload?.product,
          price,
          stock,
          description,
          tags,
        };
      } else {
        values = {
          _id: props.payload?.stock?._id,
          product: props.payload?.stock?.product,
          price,
          stock,
          description,
          tags,
        };
      }
    } else {
      if (newProductMode) {
        values = {
          product: props.payload?.product,
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
          _id: props.payload?.stock?._id,
          product: props.payload?.stock?.product,
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
      SheetManager.hide(props.sheetId, {
        payload: "edit-failed",
      });
    }

    dispatch(setProducts(stockResponse.data!));

    SheetManager.hide(props.sheetId, {
      payload: "edit-success",
    });
  };

  const handleDeleteProduct = async (id: string) => {
    SheetManager.hide(props.sheetId, {
      payload: "delete",
    });
  };

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <ScrollView>
        <View className="bg-lightbg dark:bg-darkbg p-3">
          <View className="mb-3">
            {!isBulk ? (
              <View className="flex flex-row items-center">
                <View className="flex-none w-1/4">
                  <View className="rounded-lg bg-gray-200 w-[90px] h-[90px]"></View>
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
                {/* <TextHeading4 centered extraClasses="mx-2">
                  {stock}
                </TextHeading4> */}
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
                onPressFn={() =>
                  handleDeleteProduct(props.payload?.stock?._id!)
                }
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
    </ActionSheet>
  );
}
