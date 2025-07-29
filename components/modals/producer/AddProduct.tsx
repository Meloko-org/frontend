import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import productsTools from "../../../modules/productsTools";

import { View, Modal, StyleSheet, Alert } from "react-native";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import ButtonBack from "../../utils/buttons/Back";
import TextHeading4 from "../../utils/texts/Heading4";
import InputText from "../../utils/inputs/Text";
import AvailableProduct from "../../cards/AvailableProduct";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import { ProductData } from "../../../types/API";

type AddProductModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
  afterAddProducts: () => void;
};

export default function AddProductModal(
  props: AddProductModalProps,
): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;
  const { getToken } = useAuth();

  const [availableProducts, setAvailableProducts] = useState<ProductData[]>([]);
  const [productsToAdd, setProductsToAdd] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (props.isVisible) {
      setAvailableProducts([]);
      setProductsToAdd([]);
    }
  }, [props.isVisible]);

  const handleSearchProduct = async () => {
    try {
      const token = await getToken();
      console.log(token);
      if (token) {
        const data = await productsTools.getAvailableProductsForAShop(
          token,
          searchTerm,
        );
        if (data) {
          if ("message" in data) {
            Alert.alert("Informations", data.message);
          } else {
            // création de le liste des produits
            setAvailableProducts(data);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductsToAdd = (newProductId: string) => {
    setProductsToAdd((prevProductIds) => {
      if (prevProductIds.includes(newProductId)) {
        return prevProductIds.filter((id) => id != newProductId);
      }
      return [...prevProductIds, newProductId];
    });
  };

  const handleAddProducts = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await productsTools.addProductsToAShop(
          token,
          productsToAdd,
        );

        if (data) {
          Alert.alert("", data.message);
          props.afterAddProducts();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(availableProducts);
  console.log("toAdd: ", productsToAdd);
  console.log("searchTerm:", searchTerm);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView style={bgStyle}>
        <View className="flex-1 flew-row w-full">
          <ButtonBack
            extraClasses=""
            onPressFn={() => props.onCloseFn(false)}
          />
          <TextHeading4 centered={true} extraClasses="mb-5">
            {`Ajouter des produits\nà la boutique`}
          </TextHeading4>
        </View>

        <View>
          {/* Global Search Bar */}
          <InputText
            label="recherchez des produits"
            placeholder="avant de les ajouter..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            iconName="search"
            size="large"
            extraClasses="my-3"
            onIconPressFn={handleSearchProduct}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="p-3">
          {availableProducts.length > 0 && (
            <View>
              {availableProducts.map((product) => (
                <AvailableProduct
                  key={product._id}
                  product={product}
                  extraClasses="mb-2"
                  onHighlightProduct={updateProductsToAdd}
                />
              ))}
              <ButtonPrimaryEnd
                label="Ajouter les produits"
                iconName="plus"
                // disabled={isValidateLoading}
                extraClasses="my-5"
                onPressFn={() => handleAddProducts()}
                // isLoading={isValidateLoading}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: "#262E20",
    padding: 10,
  },
  light: {
    flex: 1,
    backgroundColor: "#FCFFF0",
    padding: 10,
  },
});
