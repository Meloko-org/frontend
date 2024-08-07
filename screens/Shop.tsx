import { Text, Image, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';

const FontAwesome = _FontAwesome as React.ElementType;

interface ShopData {
  name: string;
  logo: string;
  description: string;
  [key: string]: any; 
}

export default function ShopUserScreen() {
  const [shopData, setShopData] = useState<ShopData[]>([]);
  const [count, setCount] = useState<number>(3.5);

  useEffect(() => {
    fetch(`http://localhost:3000/shops/66b339729a76167d3a93df3b`) // A MODIFIER ${AMODIFIER}
      .then(resp => resp.json())
      .then(data => {
        let shopBase: ShopData[] = [];
        if (data.result) {
          shopBase.push(data.shopFound);
        }
        setShopData(shopBase);
      });
  }, []);

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

  const shop = shopData.map((data, i) => {
    return (
      <View key={i}>
        <Text style={styles.texte}>{data.name}</Text>
        <View style={styles.starsContainer}>{renderStars(count)}</View>
        <Image source={{ uri: data.logo }} style={styles.logo} />
        <Text>{data.description}</Text>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      {shop}
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
});