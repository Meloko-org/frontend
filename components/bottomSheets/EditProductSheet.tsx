import React, { useEffect, useState } from "react";
import ActionSheet, {
  SheetProps,
  ScrollView,
} from "react-native-actions-sheet";

import TextHeading2 from "../utils/texts/Heading2";

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
import { TagData } from "../../types/API";
import SelectableTag from "../utils/badges/SelectableTag";

export default function EditProductSheet(props: SheetProps<"edit-product">) {
  const [isBulk, setBulk] = useState<boolean>(false);

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>("");
  const [weightPerUnit, setWeightPerUnit] = useState<string | undefined>("");
  const [price, setPrice] = useState<number | undefined>(0);
  const [stock, setStock] = useState<number | undefined>(0);
  const [description, setDescription] = useState<string | undefined>("");
  const [pricePerKilo, setPricePerKilo] = useState<number | undefined>(0);
  const [origin, setOrigin] = useState<string | undefined>("");
  const [format, setFormat] = useState<string | undefined>("");
  const [portion, setPortion] = useState<string | undefined>("");
  const [bestBeforeDate, setBestBeforeDate] = useState<string | undefined>("");
  const [tags, setTags] = useState<TagData[] | undefined>([]);

  useEffect(() => {
    // si on affiche un produit renseigné (!= produit vierge)
    if (props.payload?.stock !== null) {
      console.log("customName :", props.payload?.stock?.productCustomName);
      // détermine si c'est un produit vrac
      const bulk = props.payload?.stock?.productCustomName === undefined;
      setBulk(bulk);

      setPrice(Number(props.payload?.stock.price.$numberDecimal));
      setStock(Number(props.payload?.stock.stock.$numberDecimal));

      if (!bulk) {
        setName(props.payload?.stock?.productCustomName);
        setPricePerKilo(
          Number(props.payload?.stock?.pricePerKilo.$numberDecimal),
        );
        setOrigin(props.payload?.stock?.origin);
        setFormat(props.payload?.stock?.format);
        setPortion(props.payload?.stock?.portion);
        setBestBeforeDate(props.payload?.stock?.bestBeforeDate);
        setDescription(props.payload?.stock.description);
        setWeightPerUnit(props.payload?.stock.weightPerUnit);
      } else {
        setWeightPerUnit(
          props.payload?.stock.product.weight.measurement.$numberDecimal +
            " " +
            props.payload?.stock.product.weight.unit,
        );
        setTags(props.payload?.stock.tags);
      }
    }
  }, []);

  const tagList = tags?.map((tag, index) => (
    <SelectableTag
      key={index}
      value={tag.name}
      selected={true}
      extraClasses="mr-1"
      onPressFn={() => {}}
    />
  ));

  const handleQuantityChange = async (change: number) => {
    let newStock = Number(stock) + change;

    if (newStock < 0) {
      newStock = 0;
    }

    setStock(newStock);
  };

  console.log(JSON.stringify(props.payload?.stock, null, 2));
  console.log("produit vrac :", isBulk);

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
                    placeholder="sdfgsdf"
                    value={name}
                    onChangeText={(value: string) => setName(value)}
                  />
                </View>
              </View>
            ) : (
              <View className="flex flex-row">
                <View className="flex-none">
                  <Image
                    source={
                      props.payload?.stock?.product.image
                        ? { uri: props.payload?.stock.product.image }
                        : require("../../assets/icon.png")
                    }
                    className="rounded-xl w-20 h-20 mr-3"
                    alt={`Illustration du produit ${props.payload?.stock?.product.name}`}
                    resizeMode="stretch"
                    width={96}
                    height={64}
                  />
                </View>
                <View className="flex flex-row grow">
                  <TextHeading3>
                    {props.payload?.stock?.product.family.name +
                      " " +
                      props.payload!.stock?.product.name}
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
              <View className="flex flex-row justify-center w-12">
                <TextHeading4 centered extraClasses="mx-2">
                  {stock}
                </TextHeading4>
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

          <TextBody1 extraClasses="font-bold mt-5">TAGS SUGGÉRÉS</TextBody1>
          <View className="flex flex-row">{tagList}</View>
        </View>
      </ScrollView>

      <View className="flex flex-row px-3 py-2 bg-lightbg dark:bg-darkbg space-x-1">
        <View className="w-2/5 pr-2">
          <SecondaryButton
            label={`Dupliquer\nproduit`}
            extraClasses="h-14"
            textClasses="text-sm"
            onPressFn={() => {}}
            disabled={false}
            isLoading={false}
          />
        </View>
        <View className="w-3/5">
          <PrimaryButton
            label="Sauvegarder"
            disabled={isSaveLoading}
            onPressFn={() => {}}
            isLoading={isSaveLoading}
            extraClasses="h-14"
          />
        </View>
      </View>
    </ActionSheet>
  );
}
