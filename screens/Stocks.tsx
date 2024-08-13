import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuth } from '@clerk/clerk-expo';// utliser dans stockcontroller.js
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';

import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

//ma navigation pour l'écran des stocks(rajouter dans types)
type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GestionDesStocks'
>;
type Props = {
  navigation: StocksScreenNavigationProp;
};

// interface pour mes stocks(en prenant en compte que c'est un composant enfant de ma boutique)
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  //dois-je utiliser une variable pour reduire ou ajouter des categories plus tard?? 
  
  //Clerk
  const { getToken } = useAuth();
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;
  
  // pour récupérer les stocks via l'API si jamais il existe.
 /* useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = await getToken();
        // MArequête pour récupérer les stocks
        const response = await fetch(`${API_ROOT}/stocks/{shopId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching stocks: ${response.statusText}`);
        }
        // pour la mise à jour des stocks avec ce que j'ai récupérées comme données, mon erreur vient peut être de là
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchStocks();
  }, [API_ROOT, getToken]);*/
  
  // fonction pour le changement de quantité de stock
  const handleQuantityChange = useCallback(async (id: string, change: number) => {
    const stockToUpdate = stocks.find(stock => stock._id === id);
    if (!stockToUpdate) return;

    const newStock = stockToUpdate.stock + change;
    
    try {
      const token = await getToken();
      // la requête pour mettre à jour les stocks
      const response = await fetch(`${API_ROOT}/stocks/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          product: stockToUpdate.product._id, 
          shop: stockToUpdate.shop, 
          stock: newStock, 
          price: stockToUpdate.price,
          tags: stockToUpdate.tags 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating stock: ${response.statusText}`);
      }
      // ce qui permet de mettre à jour de l'état des stocks
      //dois-je crée une constante pour pouvoir enregistrer les donnés de la réponse JSON?? 
      setStocks(prevStocks => prevStocks.map(stock => 
        stock._id === id ? { ...stock, stock: newStock } : stock
      ));
    } catch (error) {
      console.error("Update error:", error);
    }
  }, [stocks, getToken, API_ROOT]);

  // variable pour filtrer mon stock selon ma recherhe
  const filteredStocks = stocks.filter(stock =>
    stock.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const categories = Array.from(new Set(stocks.map(stock => stock.shop)));

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Text style={styles.title}>Mes Stocks</Text>
      {categories.map(category => (
        <View key={category}>
          <Text style={styles.categoryTitle}>{category.toUpperCase()} ({stocks.filter(s => s.shop === category).length})</Text>
          <TextInput
            placeholder={`Rechercher un produit dans ${category.toLowerCase()} ...`}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          {filteredStocks.filter(stock => stock.shop === category).map(stock => (
            <View key={stock._id} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text>{stock.product.name}</Text>
                <Text>{`${stock.stock} unités`}</Text>
                <Text>{`${stock.price} €`}</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity onPress={() => handleQuantityChange(stock._id, -1)}>
                  <FontAwesomeIcon icon={faMinus} size="lg" />
                </TouchableOpacity>
                <Text>{stock.stock}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(stock._id, 1)}>
                  <FontAwesomeIcon icon={faPlus} size="lg" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('View details')}>
                  <FontAwesomeIcon icon={faEye} size="lg" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// temporaire, en attendant tailwind css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  productInfo: {
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
