import { Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
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
  [key: string]: any;
}

export default function ShopUserScreen({ navigation }: Props) {

  const [shopData, setShopData] = useState<ShopData[]>([]);
  const [productData, setProductData] = useState<ShopData[]>([]);
  const [count, setCount] = useState<number>(0);

// Shop recovery 
  useEffect(() => {
    fetch(`${API_ROOT}/shops/66b339729a76167d3a93df3b`) // A MODIFIER (ID)
      .then(resp => resp.json())
      .then(data => {
        if (data.result) {
          const shopBase: ShopData[] = [data.shopFound];
          const productBase: ShopData[] = [data.productFound];
          setShopData(shopBase);
          setProductData(productBase)
        }
      });
  }, []);

// Star calculation if shop loaded
  useEffect(() => {
    if (shopData.length > 0) {
      calculNote(shopData);
    }
  }, [shopData]);

// Star calculation
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
        <Text>{data.description}</Text>
        <Text>CLICK & COLLECT</Text>
        <Text>MARCHE LOCAL</Text>
        <Text>KILOMETRES</Text>
        </View>
    );
  });

  // Formatting category
  const category = productData.map((data, i) => {
    for (let n = 0; n < data.length; n++) {
      return (
        <View key={i} className="flex rounded-lg shadow-lg bg-lightbg w-1/4">
        <View className="flex justify-center rounded-t-lg w-auto h-auto">
            <Image source={{uri: data[i].product.family.category.image}} className="rounded-t-lg w-24 h-16" alt={data[i].product.family.category.name} resizeMode="cover" width={100} height={50}/>
        </View>
        <View className="py-2">
            <Text className="font-bold text-darkbg dark:text-lightbg text-center">{data[i].product.family.category.name}</Text>
            <Text className="text-wrap text-slate-400 dark:text-slate-50 text-center">Nombre produits</Text>
        </View>
    </View>
    );
    }
  });

  return (
    <View>
      {shop}
      <View>
      <Text>Votre Recherche</Text>
      </View>
      <View>
      <Text>Catégories</Text>   
      {category} 
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texte: {
    color: '#000000',
    textAlign: 'center',
    marginTop: '10%',
  },
  logo: {
    width: 66,
    height: 58,
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
  recherche: {
    color: '#000000',
    textAlign: 'center',
    marginTop: '5%',
  },
});

