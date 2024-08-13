import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import React from "react";
import { useColorScheme } from "nativewind";


import Text from '../../components/utils/inputs/Text'
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd'
import Custom from '../../components/utils/buttons/Custom';
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


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};


export default function ProfilScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const dispatch = useDispatch()
  const { getToken } = useAuth()
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const { isSignedIn } = useAuth()
  const [isSigninModalVisible, setIsSigninModalVisible] = useState<boolean>(false);
  const [email, setEmail ] = useState('')
  const [password, setPassword ] = useState('')
  const [confirm, setConfirm ] = useState('')
  const [firstname, setFirstname ] = useState('')
  const [lastname, setLastname ] = useState('')

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
  }, [user])

  const handleRecord = async () => {
    try {
      const token = await getToken()
      console.log("token", token)
      const values = (email) ? {email, firstname,  lastname} : {email: null, firstname,  lastname}
      const data = await userTools.updateUser(token, values)

      if(data) {
        Alert.alert("Bienvenue", "Vous etes identifié!")
        dispatch(updateUser(data))
      }

    } catch (error) {
      console.log(error)
    }
  }

  const switchProducer = () => {
    navigation.navigate('TabNavigatorProducer', {
      screen: 'Accueil',
    })
  }

  const toggleMode = () => {
    if(graphicMode === 'Light') {
      setGraphicMode('Dark')
    } else {
      setGraphicMode('Light')
    }
    toggleColorScheme()
  }

  return (

    <SafeAreaView style={styles.container} className="bg-lightbg dark:bg-darkbg">
      <View className="p-5">
      <TextHeading2 extraClasses="mb-5">Profil</TextHeading2>
      {
        isSignedIn && (
          <View className="h-full relative flex items-center">
            <View className="w-full">
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
                <View className="ml-2">
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
            <View className="rounded-full bg-warning flex justify-center items-center mb-5 w-[50px] h-[50px]">
              <FontAwesome name="github-alt" size={35} color="#FFFFFF"  className="absolute" />
            </View>
            <ButtonPrimaryEnd 
              label="Enregistrer"
              iconName="save"
              disabled={false}
              onPressFn={() => handleRecord()}
              ></ButtonPrimaryEnd>
            <View className="mt-5">
              <ButtonPrimaryEnd
                label={`version ${(graphicMode === 'Light') ? "Dark" : "Light"}`}
                iconName="arrow-right"
                disabled={false}
                onPressFn={toggleMode}
              ></ButtonPrimaryEnd>
            </View>
          </View>
              <Custom
                label="Basculer en mode Producteur"
                extraClasses="bg-tertiary dark:bg-lightbg rounded-full px-5 absolute bottom-[250px] h-[60px]"
                textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
                onPressFn={switchProducer}
              ></Custom>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});