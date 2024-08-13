import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from "react";
import Text from '../../components/utils/inputs/Text'
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd'
import { useAuth } from '@clerk/clerk-expo'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UserState, updateUser } from '../../reducers/user';
import SignInScreen from '../Signin';
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading4 from '../../components/utils/texts/Heading4';
import TextBody1 from '../../components/utils/texts/Body1';
import TextBody2 from '../../components/utils/texts/Body2';
import userTools from '../../modules/userTools'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType


export default function ProfilScreen() {
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

 

  useEffect(() =>{
    if(!isSignedIn) { 
      setIsSigninModalVisible(true)
    } else {
      setFirstname(user.firstname)
      setLastname(user.lastname)
      setEmail(user.email)
    }
  }, [isSignedIn])

  const handleRecord = async () => {
    try {
      const token = await getToken()
      console.log("token", token)
      const values = (email) ? {email, firstname,  lastname} : {email: null, firstname,  lastname}
      const data = await userTools.updateUser(token, values)

      if(data) {
        dispatch(updateUser(data))
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (

    <SafeAreaView style={styles.container} className="bg-lightbg dark:bg-darkbg">
      <View className="p-5">
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
              iconName="arrow-right"
              disabled={false}
              onPressFn={() => handleRecord()}
              ></ButtonPrimaryEnd>
            <View className="mt-5">
              <ButtonPrimaryEnd
                label="dark mode"
                iconName="arrow-right"
                disabled={false}
                onPressFn={undefined}
              ></ButtonPrimaryEnd>
            </View>
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