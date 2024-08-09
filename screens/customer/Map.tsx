import React, { useState, useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MapCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function MapCustomerScreen({ route, navigation }: Props) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [searchResults, setSearchResults] = useState([])
  const [region, setRegion] = useState({})
  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth()

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            console.log(location)
            setCurrentPosition(location.coords);
            setRegion({
              ...location.coords,
              latitudeDelta: 0.9,
              longitudeDelta: 0.9,
            })
          });
      }
    })();

    if(route.params.searchResults) {
      setSearchResults(route.params.searchResults)
    }
  }, []);

  const onTestPress = async () => {
    try {
      const token = await getToken()
      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          mode: 'cors',
        },
      })
      const data = await response.json()

      console.log(data)
    } catch (err) {
      console.error(err)   
    }
  }
  console.log(searchResults)
  const markers = searchResults.map((data, i) => {
    return <Marker key={i} coordinate={{ latitude: Number(data.address.latitude.$numberDecimal), longitude: Number(data.address.longitude.$numberDecimal) }} title={data.name} />;
  });

  return (
    <View style={styles.container}>
      <MapView mapType="hybrid" showsUserLocation={true} style={styles.map} region={region}>
        {/* {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />} */}
        {markers}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});