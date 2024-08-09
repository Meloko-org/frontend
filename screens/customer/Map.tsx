import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Button, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import ProducerSearchResult from '../../components/cards/ProducerSearchResult'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MapCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function MapCustomerScreen({ route, navigation }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
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
  const markers = searchResults.map((data, i) => {
    return (<Marker 
      key={i} 
      coordinate={{ latitude: Number(data.address.latitude.$numberDecimal), longitude: Number(data.address.longitude.$numberDecimal) }} 
      >
        <Callout onPress={() => console.log("go to the shop page")}>
          <View>
          <Text>{ data.name }</Text>
          { data.searchData.relevantProducts && <Text>Vends { data.searchData.relevantProducts.length } produit que vous recherchez</Text> }
          </View>
        </Callout>

      </Marker>)
  });

  const producersList = searchResults.map(sr => (
      <ProducerSearchResult 
        name={sr.name}
        onPressFn={
          () => { 
            navigation.navigate('TabNavigatorUser', {
              screen: 'ShopUser',
              params: { 
                shopId: sr._id,
                relevantProducts: sr.searchData.relevantProducts ? sr.searchData.relevantProducts : [] 
              },
            }) 
          }
        }
        key={sr._id}
      />

  ))

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      <MapView mapType="hybrid" showsUserLocation={true} style={styles.map} region={region}>
        {/* {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />} */}
        {markers}
      </MapView>
      {
        searchResults.length > 0 && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['10%', '50%']}
    
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <ScrollView style={{flex: 1, width: '100%'}} className='p-2'>
                <Text>Resultats ({producersList.length})</Text>
                {producersList}
              </ScrollView>
              
            </BottomSheetView>
          </BottomSheet>
        )
      }

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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});