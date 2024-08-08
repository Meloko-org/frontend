import React, { useState, useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import { LocationObjectCoords } from 'expo-location';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SearchCustomerScreen({ navigation }: Props) {
  const [userPosition, setuserPosition] = useState<Location.LocationObjectCoords>({
    latitude: 0,
    longitude: 0,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null   
  });
  const [query, setQuery] = useState<string>('')
  const [radius, setRadius] = useState<number>(0)
  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setuserPosition(location.coords);
          });
      }
    })();
  }, []);


  const onSearchPress = async () => {
    try {
      const response = await fetch(`${API_ROOT}/shops/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mode: 'cors',
        },
        body: JSON.stringify({
          query,
          radius,
          userPosition
        })
      })
      const data = await response.json()
      // console.log(data)
      // navigation.navigate('TabNavigatorUser')

      navigation.navigate('TabNavigatorUser', {
        screen: 'Accueil',
        params: { 
          search: {
            query,
            radius,
            userPosition
          },
          searchResults: data.searchResults 
        },
      });
    } catch (err) {
      console.error(err)   
    }
  }


  return (
    <View style={styles.container}>
      <Text>Que cherchez-vous ?</Text>
      <TextInput
        value={query}
        placeholder="Votre recherche ..."
        onChangeText={(value) => setQuery(value)}
      />
      <TextInput
        value={radius.toString()}
        placeholder="radius"
        onChangeText={(value) => setRadius(Number(value))}
      />
      <Button title="Chercher" onPress={onSearchPress} /> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});