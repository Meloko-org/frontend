import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, View, ScrollView, SafeAreaView, } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import { Region } from 'react-native-maps';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TextHeading3 from '../../components/utils/texts/Heading3'
import CardProducer from '../../components/cards/ProducerSearchResult'
import MapSearchBox from '../../components/map/MapSearchBox'
import { ShopData } from '../../types/API';
import { useColorScheme } from "nativewind";

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
  const { colorScheme, toggleColorScheme } = useColorScheme();

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


    if(route.params && route.params.searchResults) {
      setSearchResults(route.params.searchResults)
    }
  }, [route.params]);

  const producersList = searchResults && searchResults.map((sr: ShopData) => (
    <CardProducer 
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


  const markers = searchResults && searchResults.map((data: ShopData, i) => {
    return (
      <Marker 
        key={i} 
        coordinate={{ latitude: Number(data.address.latitude.$numberDecimal), longitude: Number(data.address.longitude.$numberDecimal) }} 
      >
        <Callout 
          tooltip={true}
          onPress={
          () => { 
            navigation.navigate('TabNavigatorUser', {
              screen: 'ShopUser',
              params: { 
                shopId: data._id,
                distance: data.searchData.distance,
                relevantProducts: data.searchData.relevantProducts ? data.searchData.relevantProducts : [] 
              },
            }) 
          }
        } style={{ backgroundColor: (colorScheme === "dark") ? '#262E20' : '#FCFFF0', borderRadius: 10 }}>
          <CardProducer 
            shopData={data}
            key={data._id}
          />
        </Callout>
      </Marker>
    )
  });


  const handleSheetChanges = useCallback((index: number) => {
  }, []);

  return (
    <View style={styles.container}>
      <MapView mapType="hybrid" showsUserLocation={true} style={styles.map} region={region} userInterfaceStyle='dark'>
        {/* {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />} */}
        {markers}
      </MapView>
      <SafeAreaView className='w-full h-full absolute'>
      <View className="flex flex-row justify-center" style={{position: 'absolute', top: 50, width: '100%'}}>
        <MapSearchBox
          search={(route.params && route.params.search) ? route.params.search : undefined}
          refrechResultsFn={(newSearchResults: ShopData[]) => setSearchResults(newSearchResults)}
          displayMode='widget'
        />
      </View>
      {
        searchResults.length > 0 && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['25%', '50%']}
            handleStyle={{ backgroundColor: (colorScheme === "dark") ? '#444C3D' : '#FFF' }}
            handleIndicatorStyle={{ backgroundColor: (colorScheme === "dark") ? '#FCFFF0' : '#444C3D' }}
            onChange={handleSheetChanges}
          >
            <BottomSheetView 
              style={[styles.contentContainer, { backgroundColor: (colorScheme === "dark") ? '#262E20' : '#FCFFF0' }]} 
              
            >
              <View className='px-3 w-full'>
                <TextHeading3
                  extraClasses='mt-2 mb-4 h-10'
                >
                  { `${producersList.length.toString()} Resultats `} 
                </TextHeading3>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, width: '100%'}} className='px-3'>
                {producersList}
              </ScrollView>
              
            </BottomSheetView>
          </BottomSheet>
        )
      }

      </SafeAreaView>      

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
    alignItems: 'center'
  },
});