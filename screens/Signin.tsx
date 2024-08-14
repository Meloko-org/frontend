import { useSignIn, useSignUp, useOAuth } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { TextInput, Button, View, Modal, SafeAreaView, TouchableOpacity, Text } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'
import TextHeading2 from '../components/utils/texts/Heading2'
import TextHeading3 from '../components/utils/texts/Heading3'
import InputText from '../components/utils/inputs/Text'
import ButtonPrimaryEnd from '../components/utils/buttons/PrimaryEnd'
import ButtonBack from '../components/utils/buttons/Back'
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../reducers/user";
import { UserState } from '../reducers/user'
import userTools from '../modules/userTools'
import { useAuth } from '@clerk/clerk-expo'


type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

// Warm up the android browser to improve UX
// https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {

    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen(props) {
  useWarmUpBrowser()  
  const [isSigninModalVisible, setIsSigninModalVisible] = useState<boolean>(false);

  // need to get the user infos
  const { signOut, isSignedIn, getToken } = useAuth()
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!
  // and store user infos in the store
  const dispatch = useDispatch()
  // Email verification status
  const [pendingVerification, setPendingVerification] = useState<boolean>(false)
  // Email verification code
  const [code, setCode] = useState<string>('')

  // Import the Clerk Auth functions
  const { signIn, setActive, isLoaded } = useSignIn()
  const { signUp } = useSignUp()

  // import the Clerk Google OAuth flow
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [newEmailAddress, setNewEmailAddress] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [performedSignedIn, setPerformedSignedIn] = useState(false)
  const [performedSignedUp, setPerformedSignedUp] = useState(false)

  useEffect(() => {
    setIsSigninModalVisible(props.showModal ? true : false)
  }, [props.showModal])


  useEffect(() => {
    if(isSignedIn) {
      console.log("is signedin")
      if(performedSignedIn) {
        console.log("performed signedin")
        fetchData()
        setPerformedSignedIn(false)
        setPerformedSignedUp(false)
      }

      if(performedSignedUp) {
        console.log("performed signup")
        setTimeout(() => {
          console.log("execute timeout")
          fetchData()
          setPerformedSignedIn(false)
          setPerformedSignedUp(false)
        }, 3000);
      }
    } else {
      console.log("is not signedin")

    }


  }, [isSignedIn, performedSignedIn, performedSignedUp])

  const fetchData = async () => {
    try {
      console.log("fetch data")
      // store user's info in the store
      const token = await getToken() 
      const user = await userTools.getUserInfos(token)

      if(user) {
        dispatch(updateUser(user))
        handleCloseModal()
      }
    } catch (error) {
      console.error(error)
    }
  }


  // Signin/up with Google
  const onGoogleAuthPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return
    }

    try {
      // Try to start the Google OAuth flow
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'Meloko' }), // Redirect path on successful signin
      })

      // If the signin event went well
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        setPerformedSignedIn(true)
      } else {

      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))   
    }
  }, [])

  
  const onSignUpPress = async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return
    }

    try {
      // Try to signup
      await signUp.create({
        emailAddress: newEmailAddress,
        password: newPassword,
      })

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Verification is pending
      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return
    }

    try {
      // Try to verify the email with the provided code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If the verification event is sucessfull 
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        setPerformedSignedUp(true)
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }


  // Signin the user with Clerk
  const onSignInPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return
    }

    try {
      // Try to signin
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If the signing event went well
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        setPerformedSignedIn(true)

      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  const handleCloseModal = () => {
    props.onCloseFn()
    setIsSigninModalVisible(false)
  }

  return (
    <Modal visible={isSigninModalVisible} animationType="slide" onRequestClose={handleCloseModal}>
      <SafeAreaView className='bg-lightbg flex-1 dark:bg-darkbg'>
        <View className='p-3 flex items-center'>
          <ButtonBack 
            onPressFn={handleCloseModal}
          />
          <TextHeading2 extraClasses='mb-3'>Se connecter</TextHeading2>
          <ButtonPrimaryEnd 
              label="Google" 
              iconName="google" 
              onPressFn={onGoogleAuthPress} 
              extraClasses='w-full mb-5'
            />
          <InputText 
            value={emailAddress}
            onChangeText={(newEmail: string) => setEmailAddress(newEmail)}
            placeholder="example@gmail.com" 
            label="Email"
            autoCapitalize="none"
            extraClasses="w-full mb-2"
          />
          <InputText 
            value={password}
            onChangeText={(newPassword: string) => setPassword(newPassword)}
            placeholder="example@gmail.com" 
            label="Mot de passe"
            autoCapitalize="none"
            extraClasses="w-full mb-2"
            secureTextEntry={true}
          />
          <ButtonPrimaryEnd 
              label="Connection" 
              iconName="sign-in" 
              onPressFn={onSignInPress} 
              extraClasses='w-full mb-5'
            />

          <TextHeading2 extraClasses='mb-2'>Créer un compte</TextHeading2>


          {!pendingVerification ? (
            <>
              <InputText 
                value={newEmailAddress}
                onChangeText={(newEmail: string) => setNewEmailAddress(newEmail)}
                placeholder="example@gmail.com" 
                label="Email"
                autoCapitalize="none"
                extraClasses="w-full mb-2"
              />
              <InputText 
                value={newPassword}
                onChangeText={(newPassword: string) => setNewPassword(newPassword)}
                placeholder="example@gmail.com" 
                label="Mot de passe"
                autoCapitalize="none"
                extraClasses="w-full mb-2"
                secureTextEntry={true}
              />
              <ButtonPrimaryEnd 
                label="Inscription" 
                iconName="arrow-right" 
                onPressFn={onSignUpPress} 
                extraClasses='w-full mb-5'
              />
            </>
          ) : (
            <>
              <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
              <Button title="Verify Email" onPress={onPressVerify} />
            </>
          )}
        </View>
      </SafeAreaView>
  </Modal>
  )

  
}
