import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { useAuth } from "@clerk/clerk-expo";
//import Product from '../components/cards/Products';

const FontAwesome = _Fontawesome as React.ElementType;

// Navigation type
type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GestionDesStocks"
>;

type Props = {
  navigation: StocksScreenNavigationProp;
};

// Stock interface
interface Stock {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  shop: string;
  stock: number;
  price: number;
  tags: string[];
}
export default function StocksScreen({ navigation }: Props) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [shopId, setShopId] = useState<string>("66b339729a76167d3a93df3b");
  const { getToken } = useAuth();
  const API_ROOT = process.env.EXPO_PUBLIC_API_ROOT!;

  const fetchStocks = async () => {
    fetch(`${API_ROOT}/stocks/${shopId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.stocks) {
          throw new Error("Failed to fetch stocks");
        }
        console.log("Stocks fetched from API:", data.stocks);
        setStocks(data.stocks);
      })
      .catch((error) => console.error("Error fetching stock:", error));
  };

  useEffect(() => {
    fetchStocks();
  }, [shopId]);

  const handleQuantityChange = async (id: string, change: number) => {
    const stockToUpdate = stocks.find((stock) => stock._id === id);
    if (!stockToUpdate) return;

    const newStock = stockToUpdate.stock + change;
    console.log("Attempting to update stock:", { id, change, newStock });

    try {
      const token = await getToken();
      const response = await fetch(`${API_ROOT}/stocks/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: stockToUpdate.product._id,
          shop: stockToUpdate.shop,
          stock: newStock,
          price: stockToUpdate.price,
          tags: stockToUpdate.tags,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock._id === id ? { ...stock, stock: newStock } : stock,
        ),
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const totalProducts = stocks.length;

  const filteredStocks = stocks.filter((stock) =>
    stock.product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categories = Array.from(new Set(stocks.map((stock) => stock.shop)));

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Mes Stocks</Text>

      {/* "Tous mes produits" Section */}
      <View style={styles.allProductsSection}>
        <FontAwesome name="square" style={styles.allProductsIcon} />
        <Text style={styles.allProductsText}>
          TOUS MES PRODUITS ({totalProducts})
        </Text>
      </View>

      {/* Global Search Bar */}
      <TextInput
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.globalSearchInput}
      />

      <ScrollView style={styles.scrollContainer}>
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <FontAwesome name="square" style={styles.categoryIcon} />
              <Text style={styles.categoryTitle}>
                {category.toUpperCase()} (
                {stocks.filter((s) => s.shop === category).length})
              </Text>
            </View>
            {filteredStocks
              .filter((stock) => stock.shop === category)
              .map((stock) => (
                <View key={stock._id} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>
                        {stock.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {stock.price} € / 100g
                      </Text>
                    </View>
                    <View style={styles.productQuantityContainer}>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(stock._id, -1)}
                        style={styles.quantityButton}
                      >
                        <FontAwesome name="minus" style={styles.quantityIcon} />
                      </TouchableOpacity>
                      <Text style={styles.productQuantity}>{stock.stock}</Text>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(stock._id, 1)}
                        style={styles.quantityButton}
                      >
                        <FontAwesome name="plus" style={styles.quantityIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      /* View details */
                    }}
                    style={styles.viewButton}
                  >
                    <FontAwesome name="eye" style={styles.viewIcon} />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  allProductsSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  allProductsIcon: {
    fontSize: 20,
    color: "#D4E157",
    marginRight: 10,
  },
  allProductsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  globalSearchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  categoryIcon: {
    fontSize: 20,
    color: "#D4E157",
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productRow: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  productInfo: {
    flex: 1,
  },
  productDetails: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 12,
    color: "#666",
  },
  productQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#D4E157",
    padding: 5,
    borderRadius: 3,
  },
  quantityIcon: {
    fontSize: 16,
    color: "#333",
  },
  productQuantity: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  viewButton: {
    backgroundColor: "#D4E157",
    padding: 10,
    borderRadius: 5,
  },
  viewIcon: {
    fontSize: 20,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#FCFFF0",
  },
  footerIcon: {
    fontSize: 24,
    color: "#333",
  },
});
