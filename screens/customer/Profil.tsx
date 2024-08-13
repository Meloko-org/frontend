import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import React from "react";
import { useColorScheme } from "nativewind";

import Text from '../../components/utils/inputs/Text'
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd'
import { useAuth } from '@clerk/clerk-expo'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UserState, updateUser } from '../../reducers/user';
import SignInScreen from '../Signin';
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextBody1 from '../../components/utils/texts/Body1';
import TextBody2 from '../../components/utils/texts/Body2';
import userTools from '../../modules/userTools'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType


export default function ProfilScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth()

  const dispatch = useDispatch()
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [isSigninModalVisible, setIsSigninModalVisible] = useState<boolean>(false);
  const [email, setEmail ] = useState('')
  const [password, setPassword ] = useState('')
  const [confirm, setConfirm ] = useState('')
  const [firstname, setFirstname ] = useState('')
  const [lastname, setLastname ] = useState('')
  const [isUserSaveLoading, setUserSaveLoading] = useState(false)

 

  useEffect(() =>{
    console.log(user.firstname)
    if(!isSignedIn) { 
      setIsSigninModalVisible(true)
    } else {
      setFirstname(user.firstname)
      setLastname(user.lastname)
      setEmail(user.email)
    }
  }, [user])

  const handleSaveUser = async () => {
    try {
      setUserSaveLoading(true)
      const token = await getToken()
      console.log("token", token)
      const values = (email) ? {email, firstname,  lastname} : {email: null, firstname,  lastname}
      const data = await userTools.updateUser(token, values)

      if(data) {
        Alert.alert("Mise à jour de votre profil", "Votre profil à bien été mis à jour.")
        dispatch(updateUser(data.user))
      }
      setUserSaveLoading(false)
    } catch (error) {
      console.log(error)
      setUserSaveLoading(false)

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
  return (

    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3">
      <TextHeading2 extraClasses="mb-5">Profil</TextHeading2>
      {
        isSignedIn && (
          <View>
            { user.clerkPasswordEnabled ? (
              <>
                <Text 
                  placeholder="Changez votre email"
                  label="Email"
                  onChangeText={(value: string) => setEmail(value)}
                  value={email}
                  extraClasses='mb-2'
                  ></Text>
                <Text 
                  placeholder="Saisissez votre mot de passe"
                  label="Mot de passe"
                  onChangeText={(value: string) => setPassword(value)}
                  value={password}
                  extraClasses='mb-2'
                  ></Text>
                <Text 
                  placeholder="Confirmez votre mot de passse"
                  label="Confirmation"
                  onChangeText={(value: string) => setConfirm(value)}
                  value={confirm}
                  extraClasses='mb-5'
                  ></Text>
              </>
            ) : (
              <>
                <View className="">
                  <TextBody2 extraClasses='font-bold text-secondary/60'>EMAIL</TextBody2>
                  <TextBody1 extraClasses="mb-5">{user.email}</TextBody1>
                </View>
              </>
            )}
            
            <Text 
              placeholder="Saisissez votre nom"
              label="Nom"
              onChangeText={(value: string) => setFirstname(value)}
              value={firstname}
              extraClasses='mb-2'
              ></Text>
            <Text 
              placeholder="Saisissez votre prénom"
              label="Prénom"
              onChangeText={(value: string) => setLastname(value)}
              value={lastname}
              extraClasses='mb-2'
              ></Text>
            <View className="rounded-full bg-darkbg flex justify-center items-center mb-5 w-[40px] h-[40px]">
              <FontAwesome name="arrow-right" size={25} color="#FFFFFF"  className="absolute" />
            </View>
            <ButtonPrimaryEnd 
              label="Enregistrer"
              iconName="save"
              disabled={isUserSaveLoading}
              onPressFn={() => handleSaveUser()}
              extraClasses='mb-3'
              isLoading={isUserSaveLoading}
            />
            <ButtonPrimaryEnd 
              label="Déconnection" 
              iconName="arrow-right" 
              onPressFn={onSignoutPress} 
              extraClasses='mb-3' 
            />
            <ButtonPrimaryEnd
              label={colorScheme === 'dark' ? 'Mode clair' : 'Mode sombre' }
              iconName={ colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
              disabled={false}
              onPressFn={toggleColorScheme}
            />
          </View>
          
        )
      }
      </View>

      <SignInScreen 
        showModal={isSigninModalVisible}
        onCloseFn={() => setIsSigninModalVisible(false)}
      />

    </SafeAreaView>
  );
}