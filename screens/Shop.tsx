import { Text, Image, StyleSheet, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';

const FontAwesome = _FontAwesome as React.ElementType;
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShopUser'
>;

type Props = {
  navigation: StocksScreenNavigationProp;
};

// TypeScript Function
type ShopData = {
  name: string;
  logo: string;
  description: string;
  notes: { note: { $numberDecimal: string } | number | any }[]; 
  product?: any;
  [key: string]: any;
}

export default function ShopUserScreen({ route, navigation }: Props) {
  const [shopData, setShopData] = useState<ShopData[]>([]);
  const [productData, setProductData] = useState<ShopData[]>([]);
  const [productSearch, setProductSearch] = useState<ShopData[]>([]);
  const [resultCategory, setResultCategory] = useState<{ word: string; count: number; }[]>([]);
  const [count, setCount] = useState<number>(0);
  const [shopProduct, setShopProduct] = useState<ShopData[]>([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<ShopData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

// Shop recovery
  useEffect(() => {
    const shopId = route.params.shopId;

    if (route.params.relevantProducts.length > 0) {
      const searchBase: ShopData[] = route.params.relevantProducts;
      setProductSearch(searchBase);
    }

    fetch(`${API_ROOT}/shops/${shopId}`) 
      .then(resp => resp.json())
      .then(data => {
        if (data.result) {
          setShopData([data.shopFound]);
          setProductData(data.productFound); 
        }
      });
  }, []);

// Call star calculation if shop loaded
  useEffect(() => {
    if (shopData.length > 0) {
      calculNote(shopData);
    }
  }, [shopData]);

// Call families calculation & sorting of products if shop loaded  
  useEffect(() => {
    if (productData.length > 0) {
      let family: string[] = [];
      let shopProduit: any[] = [];
      for (let i = 0; i < productData.length; i++) {
        shopProduit.push({
          category: productData[i].product.family.category.name, 
          name: productData[i].product.family.name, 
          stock: productData[i].stock, 
          tarif: productData[i].price, 
          variete: productData[i].product.name, 
          logo: productData[i].product.image,
      })
        family.push(productData[i].product.family.category.name);
      }
      setShopProduct(shopProduit)
      familiesCount(family); 
    }
  }, [productData]);

// Note calculation  
  const calculNote = (shopData: ShopData[]) => { 
    let calcul: number = 0;
    const path = shopData[0].notes;
    for (let i = 0; i < path.length; i++) {
      calcul += parseFloat(path[i].note.$numberDecimal);
    }
    calcul /= path.length;
    setCount(calcul);
  }

// Star formatting  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesome key={i} name="star" style={styles.star} />);
      } else if (i < rating) {
        stars.push(<FontAwesome key={i} name="star-half" style={styles.star} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" style={styles.star} />);
      }
    }
    return stars;
  };

// Formatting the shop received  
  const shop = shopData.map((data, i) => {
    return (
      <View key={i}>
        <Text style={styles.texte}>{data.name}</Text>
        <View style={styles.starsContainer}>{renderStars(count)}</View>
        {data.logo ? (
          <Image source={{ uri: data.logo }} style={styles.logo} resizeMode="cover" />
        ) : (
          <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="cover" />
        )}
        <Text style={styles.description}>{data.description}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>CLICK & COLLECT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>MARCHE LOCAL</Text>
          </TouchableOpacity>
          <Text style={styles.distanceText}>KILOMETRES</Text>
        </View>
      </View>
    );
  });

// Sorting products from categories by clicking
  const handleCategoryClick = (category: string) => {
    const filteredProducts = shopProduct.filter(prod => prod.category === category);
    setSelectedCategoryProducts(filteredProducts);
    console.log(filteredProducts)
    setIsModalVisible(true);
  };

// Formatting category  
  const category = resultCategory.map((cat, i) => {
    return (
      <TouchableOpacity key={i} style={styles.categoryCard} onPress={() => handleCategoryClick(cat.word)}>
        <Image source={require('../assets/icon.png')} style={styles.categoryImage} resizeMode="cover"/>
        <Text style={styles.categoryTitle}>{cat.word}</Text>
        <Text style={styles.categoryCount}>{cat.count} produits</Text>
      </TouchableOpacity>
    );
  });

// Formatting search product  
  const searchProduct = productSearch.map((prod, i) => {
    return (
      <View key={i} style={styles.productCard}>
        <Image source={require('../assets/icon.png')} style={styles.productImage} resizeMode="cover"/> 
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{prod.name}</Text>
          <Text style={styles.productDescription}>{prod.description}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.productPrice}>3.80 € / kg</Text>
          </View>
        </View>
        <View style={styles.addToCartButton}>
          <TouchableOpacity>
            <FontAwesome name="cart-plus" size={30} color="#FCFFF0"/>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

// Count families
  const familiesCount = (family: string[]) => {
    const wordCount: { [key: string]: number } = {};
    family.forEach((word) => {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });
    const result = Object.keys(wordCount).map((word) => ({
      word: word,
      count: wordCount[word],
    }));
    setResultCategory(result);
  };

  // Formatting shop product click
  const shopProductClick = selectedCategoryProducts.map((prod, i) => {
    return (
      <View key={i} style={styles.productCard}>
        <Image source={require('../assets/icon.png')} style={styles.productImage} resizeMode="cover"/> 
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{prod.name}</Text>
          <Text style={styles.productDescription}>{prod.variete}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.productPrice}>Stock : {prod.stock.$numberDecimal}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.productPrice}>Tarif : {prod.tarif.$numberDecimal} €</Text>
            </View>
        </View>
        <View style={styles.addToCartButton}>
          <TouchableOpacity>
            <FontAwesome name="cart-plus" size={30} color="#FCFFF0"/>
          </TouchableOpacity>
        </View>
      </View>
    );
  });


  return (
    <ScrollView style={styles.container}>
      {shop}
      {route.params.relevantProducts.length > 0 ?
      <View>
          <View>
        <Text style={styles.sectionTitle}>Votre Recherche</Text>
         {searchProduct} 
      </View> 
      <TouchableOpacity style={styles.resultsButton}>
        <Text style={styles.resultsButtonText}>Tous les résultats →</Text>
      </TouchableOpacity>
      </View> : null}
      <View>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <View style={styles.categoriesContainer}>{category}</View> 
      </View>
      
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>←</Text>
          </TouchableOpacity>
          <ScrollView>
            {shopProductClick}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FCFFF0',
  },
  texte: {
    color: '#000000',
    textAlign: 'center',
    marginTop: '10%',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 66,
    height: 58,
    alignSelf: 'center',
    marginVertical: 10,
  },
  star: {
    color: '#98B66E',
    fontSize: 14,
    marginHorizontal: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  headerButton: {
    backgroundColor: '#d4e157',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerButtonText: {
    fontSize: 12,
    color: '#333',
  },
  distanceText: {
    fontSize: 12,
    color: '#333',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
  },
  priceTag: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
  productPrice: {
    color: '#FCFFF0',
    fontSize: 12,
    textAlign: 'center',
  },
  addToCartButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '45%',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  resultsButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#d4e157',
    borderRadius: 10,
    alignItems: 'center',
  },
  resultsButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFFF0',
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
});


