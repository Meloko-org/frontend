import React, { useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'
import ButtonPrimaryEnd from '../components/utils/buttons/PrimaryEnd';
import TextHeading1 from '../components/utils/texts/Heading1';
import TextHeading2 from '../components/utils/texts/Heading2';
import userTools from '../modules/userTools'
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../reducers/user";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth()

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!
  // and store user infos in the store
  const dispatch = useDispatch()

  const fetchData = async () => {
    try {
      // store user's info in the store
      const token = await getToken() 
      const user = await userTools.getUserInfos(token)

      if(user) {
        console.log("updated user from home", user)
        dispatch(updateUser(user))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(isSignedIn) {
      (async () => {
        await fetchData()
      })()
    }
  }, [])

  const onTestPress = async () => {
    try {
      const token = await getToken()
      console.log(token)
      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          mode: 'cors',
        },
      })
      const data = await response.json()
    } catch (err) {
      console.error(err)   
    }
  }

  // Signout the user from Clerk
  const onSignoutPress = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))   
    }
  }

  const onMapPress = async () => {
    try {
      navigation.navigate('TabNavigatorUser', {
        screen: 'Accueil',
        params: { 
          searchResults: [] 
        },
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))   
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-lightbg dark:bg-darkbg'>
      <View className='p-3 w-full'>
      <TextHeading1 extraClasses='mb-3'>Bienvenue</TextHeading1>
      <ButtonPrimaryEnd label="Tous les producteurs" iconName="map" onPressFn={onMapPress} extraClasses='mb-3' />
      <ButtonPrimaryEnd label="Recherche" iconName="search" onPressFn={() => navigation.navigate('SearchCustomer')} extraClasses='mb-3' />
      <ButtonPrimaryEnd label="Gérer mes ventes" iconName="gear" onPressFn={() => navigation.navigate('TabNavigatorProducer')} extraClasses='mb-3' />
      {
        isSignedIn && (
          <>
            <ButtonPrimaryEnd label="Déconnection" iconName="arrow-right" onPressFn={onSignoutPress} extraClasses='mb-3' />
          </>
        )
      }
      <Button title="Test" onPress={onTestPress} /> 
      <Button title="Test" onPress={() => navigation.navigate('TabNavigatorProducer', { screen: 'Stocks'})} /> 
    </View>
    </SafeAreaView>

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