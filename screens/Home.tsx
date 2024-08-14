import React, { useEffect, useState } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'
import SignInScreen from './Signin';
import ButtonPrimaryEnd from '../components/utils/buttons/PrimaryEnd';
import TextHeading1 from '../components/utils/texts/Heading1';
import TextHeading2 from '../components/utils/texts/Heading2';
import TextBody1 from '../components/utils/texts/Body1';
import userTools from '../modules/userTools'
import { useDispatch, useSelector } from "react-redux";
import { UserState, updateUser } from '../reducers/user';

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
  const [ isSigninModalVisible, setIsSigninModalVisible ] = useState(false)

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!
  
  const dispatch = useDispatch()
  const userStore = useSelector((state: { user: UserState }) => state.user.value)

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

  /**
   * au clic sur le bouton "Compte Pro"
   * - si le user n'est pas signIn, on affiche la modale d'inscription
   * - si le user est signIn mais qu'il n'a pas de compte pro, redirection vers la page producerProfil
   * - si le user est signIn et qu'il a un compte pro, redirection vers la page 'accueil' du producer
   */
  const handleProducer = () => {
    if(!isSignedIn) {
      setIsSigninModalVisible(true)
    }
    redirectProducer()
  }

  const redirectProducer = () => {
    console.log("producerId: ", userStore.producerId)
    if(userStore.producerId === null) {
      console.log("navigate profile")
      navigation.navigate('TabNavigatorProducer', {
        screen: 'ProducerProfile'
      })
    } else {
      console.log("navigate accueil")
      navigation.navigate('TabNavigatorProducer', {
        screen: 'Accueil'
      })
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-lightbg dark:darkbg mt-5'>
      <View className='flex-1 p-3 w-full h-full'>
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

        <View className="relative h-full w-full"> 
          <View className="flex-1 absolute bottom-[500px] w-full h-[100px] items-center">
            <TextBody1 extraClasses='px-5 text-wrap' centered={true}>Producteurs, connectez-vous ou créez votre compte professionel</TextBody1>
            <ButtonPrimaryEnd
              label="Compte Pro"
              iconName="arrow-right"
              disabled={false}
              onPressFn={() => handleProducer()}
              extraClasses='w-full'
              ></ButtonPrimaryEnd>
          </View>
        </View>
      </View>

      <SignInScreen   
        showModal={isSigninModalVisible}
        onCloseFn={() => {
          setIsSigninModalVisible(false)
          redirectProducer()
        }}
      />

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