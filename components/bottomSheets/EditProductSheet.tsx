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

export default function EditProductSheet(props: SheetProps<"edit-product">) {
  const [isBulk, setBulk] = useState<boolean>(false);

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>("");
  const [weightPerUnit, setWeightPerUnit] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [pricePerKilo, setPricePerKilo] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [portion, setPortion] = useState<string>("");
  const [bestBeforeDate, setBestBeforeDate] = useState<string>("");

  useEffect(() => {
    // si on affiche un produit renseigné (!= produit vierge)
    if (props.payload?.stock !== null) {
      // détermine si c'est un produit vrac
      setBulk(props.payload?.stock?.productCustomName === null);

      if (!isBulk) {
        setName(props.payload?.stock?.productCustomName);
      }
    }
  }, []);

  console.log(JSON.stringify(props.payload?.stock, null, 2));

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <ScrollView>
        <View className="bg-lightbg dark:bg-darkbg p-3">
          {/* <Text className="text-sm text-dark text-right leading-4 font-bold dark:text-white">
            {`FICHE\nPRODUIT`}
          </Text> */}
          <View className="">
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
            <TextInput
              className="bg-white rounded-lg w-36 text-right"
              value={weightPerUnit}
              onChangeText={(value: string) => setWeightPerUnit(value)}
            />
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">PRIX</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-36 text-right"
              value={weightPerUnit}
              onChangeText={(value: string) => setWeightPerUnit(value)}
            />
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">QUANTITÉ</TextBody1>
            </View>
          </View>

          <InputTextarea
            label="DESCRIPTION"
            placeholder="Saisir une description"
            value={description}
            onChangeText={(value: string) => setDescription(value)}
            extraClasses="mb-1"
          />

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">PRIX AU KILO</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-36 text-right"
              value={pricePerKilo}
              onChangeText={(value: string) => setPricePerKilo(value)}
            />
            {/* <TextHeading4 extraClasses="ml-2">€</TextHeading4> */}
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">ORIGINE</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-60 text-right"
              value={origin}
              onChangeText={(value: string) => setOrigin(value)}
            />
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">FORMAT</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-60 text-right"
              value={format}
              onChangeText={(value: string) => setFormat(value)}
            />
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">PORTION</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-60 text-right"
              value={portion}
              onChangeText={(value: string) => setPortion(value)}
            />
          </View>

          <View className="flex flex-row items-center space-x-2 mb-1">
            <View className="flex-1">
              <TextBody1 extraClasses="font-bold">{`DLC A\nRECEPTION`}</TextBody1>
            </View>
            <TextInput
              className="bg-white rounded-lg w-60 text-right"
              value={bestBeforeDate}
              onChangeText={(value: string) => setBestBeforeDate(value)}
            />
          </View>
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
            iconFamily="FontAwesome5Icon"
            iconName="sync-alt"
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
