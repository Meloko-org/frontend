import React, { useState } from "react";
import ActionSheet, {
  SheetProps,
  ScrollView,
} from "react-native-actions-sheet";

import TextHeading2 from "../utils/texts/Heading2";

import { View, Text, Image } from "react-native";
import InputText from "../utils/inputs/Text";
import TextHeading3 from "../utils/texts/Heading3";

export default function EditProductSheet(props: SheetProps<"edit-product">) {
  const [name, setName] = useState<string>("");

  console.log(JSON.stringify(props.payload?.stock, null, 2));

  return (
    <ActionSheet
      snapPoints={[90]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <ScrollView>
        <View className="bg-lightbg dark:bg-darkbg">
          <Text className="text-sm text-dark text-right leading-4 font-bold dark:text-white">
            {`FICHE\nPRODUIT`}
          </Text>
          <View className="px-3">
            {props.payload?.stock.productCustomName ? (
              <InputText
                label="NOM DU PRODUIT"
                placeholder="sdfgsdf"
                value={name}
                onChangeText={(value: string) => setName(value)}
              />
            ) : (
              <View className="flex flex-row">
                <View className="flex-none">
                  <Image
                    source={
                      props.payload?.stock.product.image
                        ? { uri: props.payload?.stock.product.image }
                        : require("../../assets/icon.png")
                    }
                    className="rounded-xl w-20 h-20 mr-3"
                    alt={`Illustration du produit ${props.payload?.stock.product.name}`}
                    resizeMode="stretch"
                    width={96}
                    height={64}
                  />
                </View>
                <View className="flex flex-row grow">
                  <TextHeading3>
                    {props.payload?.stock.product.family.name +
                      " " +
                      props.payload!.stock.product.name}
                  </TextHeading3>
                </View>
              </View>
            )}
          </View>

          <View className="h-[200px]"></View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
}
