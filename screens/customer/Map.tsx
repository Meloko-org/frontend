import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, View, ScrollView, } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import { Region } from 'react-native-maps';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TextHeading3 from '../../components/utils/texts/Heading3'
import ProducerSearchResult from '../../components/cards/ProducerSearchResult'
import MapSearchBox from '../../components/map/MapSearchBox'
import { ShopData } from '../../types/API';

type userPosition = {
  latitude: number;
  longitude: number;
} | null

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MapCustomer'
>;

type MapProps = {
  navigation: MapScreenNavigationProp;
};

export default function MapCustomerScreen({ route, navigation }: MapProps): JSX.Element {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [searchResults, setSearchResults] = useState<ShopData[]>([])
  const [region, setRegion] = useState<Region | undefined>(undefined)

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

  const producersList = searchResults.map((sr: ShopData) => (
    <ProducerSearchResult 
      shopData={sr}
      onPressFn={
        () => { 
          navigation.navigate('TabNavigatorUser', {
            screen: 'ShopUser',
            params: { 
              shopId: sr._id,
              distance: sr.searchData.distance,
              relevantProducts: sr.searchData.relevantProducts ? sr.searchData.relevantProducts : [] 
            },
          }) 
        }
      }
      key={sr._id}
      extraClasses='mb-1'
      displayMode='bottomSheet'
    />

))


  const markers = searchResults.map((data: ShopData, i) => {
    return (
      <Marker 
        key={i} 
        coordinate={{ latitude: Number(data.address.latitude.$numberDecimal), longitude: Number(data.address.longitude.$numberDecimal) }} 
      >
        <Callout onPress={
          () => { 
            navigation.navigate('TabNavigatorUser', {
              screen: 'ShopUser',
              params: { 
                shopId: data._id,
                relevantProducts: data.searchData.relevantProducts ? data.searchData.relevantProducts : [] 
              },
            }) 
          }
        }>
          <ProducerSearchResult 
            shopData={data}
            key={data._id}
          />
        </Callout>
      </Marker>
    )
  });



  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      <MapView mapType="hybrid" showsUserLocation={true} style={styles.map} region={region}>
        {/* {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />} */}
        {markers}
      </MapView>
      <View className="flex flex-row justify-center" style={{position: 'absolute', top: 50, width: '100%'}}>
        <MapSearchBox
          search={route.params.search}
          refrechResultsFn={(newSearchResults: ShopData[]) => setSearchResults(newSearchResults)}
          displayMode='widget'
        />
      </View>
      {
        searchResults.length > 0 && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['20%', '50%']}
    
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <ScrollView style={{flex: 1, width: '100%'}} className='pt-2 px-3'>
                
                <TextHeading3
                  extraClasses='mt-2 mb-4'
                >
                  { `${producersList.length.toString()} Resultats `} 
                </TextHeading3>

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
    position: 'relative'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FCFFF0'
  },
});