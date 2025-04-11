import React from "react";
import { View, Text } from "react-native";
import { StockData } from "../types/API";

type EditProductProps = {
  stock: StockData;
  onClose: () => void;
};

export default function EditProduct({ stock, onClose }: EditProductProps) {
  console.log("edit product");

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">
        Modifier : {stock.product.name}
      </Text>
    </View>
  );
}
