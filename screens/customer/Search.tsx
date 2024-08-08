import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import { LocationObjectCoords } from 'expo-location';
import Simple from '../../components/utils/inputs/Simple';
import PrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import SimpleButton from '../../components/utils/buttons/SimpleButton';
import {Slider} from '@miblanchard/react-native-slider';


type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SearchCustomerScreen({ navigation }: Props) {
  const [userPosition, setUserPosition] = useState({
    latitude: 0.0,
    longitude: 0.0
  });

  const [radius, setRadius] = useState({ value: [20] })
  const [query, setQuery] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [searchResults, setSearchResults] = useState([])
  const [myPosition, setMyPosition] = useState(false)

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  useEffect(() => {
    (async () => {
      if(userPosition.latitude !== 0 || myPosition) {
        const response = await fetch(`${API_ROOT}/shops/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            mode: 'cors', 
          },
          body: JSON.stringify({
            query,
            radius: radius.value[0],
            userPosition
          })
        })
        const data = await response.json()
    
        navigation.navigate('TabNavigatorUser', {
          screen: 'Accueil',
          params: { 
            search: {
              query,
              radius: radius.value[0],
              userPosition
            },
            searchResults: data.searchResults 
          },
        });
      }
      // console.log(userPosition)
  

    })()

  }, [userPosition, myPosition])

  const useMyPosition = async () => {
    setAddress('Ma Position')
    const result = await Location.requestForegroundPermissionsAsync();
    const status = result?.status;

    if (status === 'granted') {
      Location.watchPositionAsync({ distanceInterval: 10 },
        (location) => {
          setUserPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
        });
    }
  }

  const searchAddress = async () => {
    try {
      setMyPosition(false)
      console.log('fetching the address')
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}`)
      const data = await response.json()
      const latitude = data.features[0].geometry.coordinates[1]
      const longitude = data.features[0].geometry.coordinates[0]
      console.log(`lat: ${latitude} lon: ${longitude}`)
      setUserPosition({
        latitude: latitude,
        longitude: longitude
      });

    } catch (error) {
      console.error(error)
    }
  }

 
  const onSearchPress = async () => {
    try {
      if(address !== 'Ma Position' && address !== '') {
        await searchAddress()
      } else {
        setMyPosition(true)
      }

      console.log("user", userPosition)


      setSearchResults(data.searchResults)
    } catch (err) {
      console.error(err)   
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container} className='p-3'>
        <Text className='mb-4'>Que cherchez-vous ?</Text>
        <Simple 
          name="query" 
          value={query}
          onChangeText={setQuery}
          placeholder="Fruits moche, legume bio, pomme, banane ..." 
          label="Votre recherche"
          autoCapitalize="none"
          class="w-full"
          size="large"
        />
        <Text>Localisation</Text>
        <View className='w-full m-4 flex flex-row justify-between'>
          <Simple 
            name="address" 
            value={address}
            onChangeText={setAddress}
            placeholder="Adresse, code postal, ville ..." 
            label="Adresse"
            autoCapitalize="none"
            class="w-72"
          />
          <SimpleButton 
            name="map-marker"
            class='w-20'
            onPressFn={useMyPosition}
          />
        </View>

        <Text>Distance</Text>
        <View style={{width: '100%'}} className='px-3 flex-row'>
          <Slider
              containerStyle={{width: '80%'}}
              value={radius.value}
              step={20}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor='#000000'
              onValueChange={value => setRadius({value})}
              minimumTrackTintColor='#98B66E'
              thumbTintColor='#98B66E'
          />
          <View className='flex flex-row items-center justify-center w-20'>
            <Text>{radius.value[0]} km</Text>
          </View>
        </View>

        <PrimaryEnd name="Chercher" onPressFn={onSearchPress}></PrimaryEnd>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
});