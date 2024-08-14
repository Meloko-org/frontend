import { View, SafeAreaView, Alert } from 'react-native';
import React from "react";
import { useColorScheme } from "nativewind";


import Text from '../../components/utils/inputs/Text'
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd'
import ButtonSecondaryEnd from '../../components/utils/buttons/SecondaryEnd';
import Custom from '../../components/utils/buttons/Custom';
import { useAuth } from '@clerk/clerk-expo'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserState, updateUser } from '../../reducers/user';
import SignInScreen from '../Signin';
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextBody1 from '../../components/utils/texts/Body1';
import TextBody2 from '../../components/utils/texts/Body2';
import userTools from '../../modules/userTools'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import TextHeading4 from '../../components/utils/texts/Heading4';
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};


export default function ProfilScreen({ navigation }: Props) {
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

  const [graphicMode, setGraphicMode] = useState('Light')
 

  useEffect(() =>{
    console.log(user.firstname)
    if(!isSignedIn) { 
      setIsSigninModalVisible(true)
    } else {
      setFirstname(user.firstname)
      setLastname(user.lastname)
      setEmail(user.email)
    }
  }, [user, isSignedIn])

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

  const switchProducer = () => {
    navigation.navigate('TabNavigatorProducer', {
      screen: 'ProducerProfile',
    })
  }


  const handleOrdersPress = () => {
    navigation.navigate('TabNavigatorUser', {
      screen: 'OrderCustomer',
    })
  }

  return (

    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3">
      
      {
        isSignedIn ? (
          
          <View className="h-full relative flex items-center">
            <TextHeading2 extraClasses="mb-5">Profil</TextHeading2>
            <View className="w-full">
            { user.clerkPasswordEnabled === true ? (
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
                <View className="ml-2">
                  <TextBody2 extraClasses='font-bold text-secondary/60'>EMAIL</TextBody2>
                  <TextHeading4 extraClasses="mb-5">{user.email}</TextHeading4>
                </View>
              </>
            )}
            <View className='flex flex-row justify-between items-center'>
              <View className='flex flex-row justify-center items-center w-2/6'>
                <View className="rounded-full bg-warning flex flex-row justify-center items-center mb-5 w-[100px] h-[100px]">
                  <FontAwesome name="github-alt" size={80} color="#FFFFFF"  className="absolute" />
                </View>
              </View>

              <View className='w-4/6'>
                <Text 
                  placeholder="Saisissez votre nom"
                  label="Nom"
                  onChangeText={(value: string) => setFirstname(value)}
                  value={firstname}
                  extraClasses='mb-2'
                  />
                <Text 
                  placeholder="Saisissez votre prénom"
                  label="Prénom"
                  onChangeText={(value: string) => setLastname(value)}
                  value={lastname}
                  extraClasses='mb-2'
                  />
              </View>


            </View>

            <ButtonPrimaryEnd 
              label="Enregistrer"
              iconName="save"
              disabled={isUserSaveLoading}
              onPressFn={() => handleSaveUser()}
              extraClasses='mb-6'
              isLoading={isUserSaveLoading}
            />
            <ButtonPrimaryEnd 
              label="Mes commandes" 
              iconName="arrow-right" 
              onPressFn={handleOrdersPress} 
              extraClasses='mb-3' 
            />
            <ButtonPrimaryEnd
              label={colorScheme === 'dark' ? 'Mode clair' : 'Mode sombre' }
              iconName={ colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
              disabled={false}
              onPressFn={toggleColorScheme}
              extraClasses='mb-3'
            />
            <ButtonSecondaryEnd 
              label="Déconnection" 
              iconName="arrow-right" 
              onPressFn={onSignoutPress} 
              extraClasses='mb-3' 
            />
          </View>
              <Custom
                label="Basculer en mode Producteur"
                extraClasses="bg-tertiary dark:bg-lightbg rounded-full px-5 absolute bottom-[100px] h-[60px]"
                textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
                onPressFn={switchProducer}
              ></Custom>
          </View>
          
        ) : (
          <View className='flex justify-center items-center h-full'>
            <TextHeading2 extraClasses='mb-3'>Connectez-vous pour voir votre profil.</TextHeading2>
            <ButtonPrimaryEnd 
              label="Connexion"
              iconName='sign-in'
              extraClasses='w-full'
              onPressFn={() => setIsSigninModalVisible(true)}
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