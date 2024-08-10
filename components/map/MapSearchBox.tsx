import React, { useState, useEffect, useRef } from 'react'
import * as Location from 'expo-location';

import { Animated, View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import Simple from '../utils/inputs/Simple';
import PrimaryEnd from '../utils/buttons/PrimaryEnd';
import SimpleButton from '../utils/buttons/SimpleButton';
import {Slider} from '@miblanchard/react-native-slider';
import TextHeading2 from '../../components/utils/texts/Heading2'
import TextHeading3 from '../../components/utils/texts/Heading3'

type searchOptions = {
  query: string;
  address: string;
  radius: {
    value: number[];
  }
  userPosition: {
    latitude: number;
    longitude: number;
  }
}

type Props = {
  search?: searchOptions;
  refrechResultsFn?: Function;
  displayMode: 'fullview' | 'widget';
  navigation?: object
}

export default function MapSearchBox(props: Props): JSX.Element {

  const size = useRef(new Animated.Value(110)).current;

  const [searchOptions, setSearchOptions] = useState<searchOptions>({
    query: '',
    address: '',
    radius: {
      value: [40]
    },
    userPosition: {
      latitude: 0.0,
      longitude: 0.0
    }
  })

  const [performSearch, setPerformSearch] = useState(false)
  const [openSearchBox, setOpenSearchBox] = useState(false)

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  useEffect(() => {
    if(openSearchBox) {
      Animated.timing(size, {
        toValue: 330, 
        duration: 300, 
        useNativeDriver: false, 
      }).start();
    } else {
      Animated.timing(size, {
        toValue: 110, 
        duration: 300, 
        useNativeDriver: false, 
      }).start();  
    }

  }, [openSearchBox])

  useEffect(() => {
    if(props.search) {
      setSearchOptions(props.search)
    }
  }, [])

  useEffect(() => {
    (async () => {
      if(((searchOptions.userPosition.latitude !== 0 && searchOptions.userPosition.longitude !== 0) && performSearch)) {
        const response = await fetch(`${API_ROOT}/shops/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            mode: 'cors', 
          },
          body: JSON.stringify({
            query: searchOptions.query,
            radius: searchOptions.radius.value[0],
            userPosition: searchOptions.userPosition
          })
        })
        const data = await response.json()

        if(props.displayMode === 'widget') {
          props.refrechResultsFn && props.refrechResultsFn(data.searchResults)

        } else {
          props.navigation.navigate('TabNavigatorUser', {
            screen: 'Accueil',
            params: { 
              search: {
                address: searchOptions.address,
                query: searchOptions.query,
                radius: searchOptions.radius,
                userPosition: searchOptions.userPosition
              },
              searchResults: data.searchResults 
            },
          });
        }


      }
      setOpenSearchBox(false)
      setPerformSearch(false)
    })()

  }, [searchOptions.userPosition, performSearch])

  const useMyPosition = async () => {
    const result = await Location.requestForegroundPermissionsAsync();
    const status = result?.status;

    if (status === 'granted') {
      Location.watchPositionAsync({ distanceInterval: 10 },
        (location) => {
          setSearchOptions((prevState) => ({
            ...prevState,
            address: 'Ma Position',
            userPosition: {
              ...prevState.userPosition,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            },
          }));
          
        });
    }
  }

  const searchAddress = async () => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchOptions.address}`)
      const data = await response.json()
      const latitude = data.features[0].geometry.coordinates[1]
      const longitude = data.features[0].geometry.coordinates[0]

      setSearchOptions((prevState) => ({
        ...prevState,
        userPosition: {
          ...prevState.userPosition,
          latitude: latitude,
          longitude: longitude
        },
      }));

      // setUserPosition({
      //   latitude: latitude,
      //   longitude: longitude
      // });

    } catch (error) {
      console.error(error)
    }
  }

 
  const onSearchPress = async () => {
    try {
      if(searchOptions.address !== 'Ma Position' && searchOptions.address !== '') {
        await searchAddress()
      }
      setPerformSearch(true)
    } catch (err) {
      console.error(err)   
    }
  }
	return (
    <>
    {
      props.displayMode === 'widget' ? (
      <Pressable onPress={() => setOpenSearchBox(!openSearchBox)}>
        <Animated.View className={`rounded-lg w-100 mx-3 bg-lightbg p-2 shadow-sm dark:bg-ternary`} style={{ height: size, overflow: 'hidden' }}>
          <View className='w-full flex flex-row justify-between'>

              <Simple 
                value={searchOptions.query}
                onChangeText={(newQuery: string) => setSearchOptions((prevState) => ({
                  ...prevState,
                  query: newQuery
                }))}
                placeholder="Fruits moche, legume bio, pomme, banane ..." 
                label="Votre recherche"
                autoCapitalize="none"
                class="w-full"
                size="large"
                iconName='search'
                onIconPressFn={onSearchPress}
              />

            {/* <View className='w-1/4 flex flex-row justify-end'>
              <SimpleButton 
                iconName="search"
                extraClasses='w-20'
                onPressFn={onSearchPress}
              />
            </View> */}

          </View>
          {
    
              <View className='h-7'>
                <Text 
                  className={`${openSearchBox && 'hidden'} text-sm w-full text-center font-bold text-secondary/40 my-1`}
                >
                  Cliquez pour plus d'options !
                </Text>
              </View>    

          }

          <TextHeading3
            extraClasses='mb-4'
            centered
          >
            Localisation
          </TextHeading3>
          <View className='w-full flex flex-row justify-between'>
            <View className='w-3/4'>
            <Simple 
              value={searchOptions.address}
              onChangeText={(newAddress: string) => setSearchOptions((prevState) => ({
                ...prevState,
                address: newAddress
              }))}
              placeholder="Adresse, code postal, ville ..." 
              label="Adresse"
              autoCapitalize="none"
              class="w-full"
            />
            </View>
            <View className='w-1/4 flex flex-row justify-end'>
            <SimpleButton 
              iconName="map-marker"
              extraClasses='w-20'
              onPressFn={useMyPosition}
            />
            </View>

        </View>

          <TextHeading3
            extraClasses='mt-4 mb-2'
            centered
          >
            Distance
          </TextHeading3>
          <View style={{width: '100%'}} className='px-3 flex-row'>
            <Slider
                containerStyle={{width: '80%'}}
                value={searchOptions.radius.value}
                step={20}
                minimumValue={0}
                maximumValue={100}
                onValueChange={(newRadius: [number]) => { 
                    setSearchOptions((prevState) => ({
                      ...prevState,
                      radius: {
                        value: [...newRadius]
                      }
                    }))
                  }
                }
                minimumTrackTintColor='#98B66E'
                thumbTintColor='#98B66E'
            />
            <View className='flex flex-row items-center justify-center w-20'>
              <Text>{searchOptions.radius.value[0]} km</Text>
            </View>
          </View>
        </Animated.View>
        </Pressable>
      ) : (
        <SafeAreaView style={{flex: 1}} className='bg-lightbg dark:bg-darkbg'>
        <View style={styles.container} className='p-3'>
          <TextHeading2
            extraClasses='mb-6'
          >
            Que cherchez-vous ?
          </TextHeading2>
          <Simple 
            value={searchOptions.query}
            onChangeText={(newQuery: string) => setSearchOptions((prevState) => ({
              ...prevState,
              query: newQuery
            }))}
            placeholder="Fruits moche, legume bio, pomme, banane ..." 
            label="Votre recherche"
            autoCapitalize="none"
            class="w-full"
            size="large"
          />
          <TextHeading3
            extraClasses='my-4'
          >
            Localisation
          </TextHeading3>
          <View className='w-full flex flex-row justify-between'>
            <Simple 
              value={searchOptions.address}
              onChangeText={(newAddress: string) => setSearchOptions((prevState) => ({
                ...prevState,
                address: newAddress
              }))}
              placeholder="Adresse, code postal, ville ..." 
              label="Adresse"
              autoCapitalize="none"
              class="w-72"
            />
            <SimpleButton 
              iconName="map-marker"
              extraClasses='w-20'
              onPressFn={useMyPosition}
            />
          </View>
  
          <TextHeading3
            extraClasses='mt-4 mb-2'
          >
            Distance
          </TextHeading3>
          
          <View className='flex-row w-full mb-6'>
            <Slider
                containerStyle={{width: '80%'}}
                value={searchOptions.radius.value}
                step={20}
                minimumValue={0}
                maximumValue={100}
                onValueChange={(newRadius: [number]) => { 
                    setSearchOptions((prevState) => ({
                      ...prevState,
                      radius: {
                        value: [...newRadius]
                      }
                    }))
                  }
                }
                minimumTrackTintColor='#98B66E'
                thumbTintColor='#98B66E'
            />
            <View className='flex flex-row items-center justify-center w-20'>
              <Text>{searchOptions.radius.value[0]} km</Text>
            </View>
          </View>
  
          <PrimaryEnd label="Chercher" iconName="search" onPressFn={onSearchPress}></PrimaryEnd>
        </View>
      </SafeAreaView>
      )
    }
    
    </>

	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
});