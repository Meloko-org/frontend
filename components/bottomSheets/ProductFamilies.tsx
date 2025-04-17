import React, { useEffect, useState } from "react";
import ActionSheet, {
  SheetProps,
  ScrollView,
  SheetManager,
} from "react-native-actions-sheet";
import familyTools from "../../modules/familyTools";
import { ProductFamilyData } from "../../types/API";
import { View } from "react-native";
import SecondaryButton from "../utils/buttons/Secondary";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import TextBody1 from "../utils/texts/Body1";

export default function ProductFamiliesSheet(
  props: SheetProps<"product-families">,
) {
  const onFamilySelected = props.payload?.onFamilySelected;

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [families, setFamilies] = useState<ProductFamilyData[]>([]);

  // récupère toutes les familles d'une catégorie moins les familles
  // déjà présentes dans le shopStore pour une catégorie donnée
  const fetchFamiliesForCategory = async () => {
    const familiesResponse = await familyTools.getFamiliesByCategory(
      props.payload!.category,
    );
    if (!familiesResponse.success) {
      console.log(
        "une erreur est survenue lors de la récupération des familles.",
      );
      return;
    }
    if (familiesResponse.data) {
      const existingFamilyNames = new Set(
        shopStore?.products
          ?.filter(
            (product) =>
              product.product.family.category.name === props.payload?.category,
          )
          ?.map((product) => product.product.family.name),
      );

      const availableFamilies = familiesResponse.data.filter(
        (family) => !existingFamilyNames.has(family.name),
      );

      setFamilies(availableFamilies);
    }
  };

  useEffect(() => {
    fetchFamiliesForCategory();
  }, []);

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg p-5">
        <ScrollView>
          <View className="px-3">
            <TextHeading4 centered extraClasses="mb-4">
              Cliquez sur une catégorie pour l'ajouter.
            </TextHeading4>

            {families.length > 0 ? (
              families.map((family) => (
                <SecondaryButton
                  key={family._id}
                  label={family.name}
                  disabled={false}
                  isLoading={false}
                  onPressFn={() => {
                    onFamilySelected?.(family.name);
                    SheetManager.hide("product-families");
                  }}
                  extraClasses="h-14 mb-3"
                  textClasses="text-xl"
                />
              ))
            ) : (
              <TextBody1
                centered
              >{`Il n'y a plus de catégorie de ${props.payload?.category} disponibles.`}</TextBody1>
            )}
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
