import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { StyleSheet, Text, TextInput, Button, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'

import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../reducers/user";
import { UserState } from '../reducers/user'
const { getUserInfos } = require('../modules/userTools')
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

export default function SignInScreen({ navigation: { goBack } }: Props) {
  useWarmUpBrowser()  

  // need to get the user infos
  const { getToken } = useAuth()
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!
  // and store user infos in the store
  const dispatch = useDispatch()
  const userStore = useSelector((state: { user : UserState}) => state.user.value)

  // Import the Clerk Auth functions
  const { signIn, setActive, isLoaded } = useSignIn()

  // import the Clerk Google OAuth flow
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [password, setPassword] = useState<string>('')

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
        // Go back to the previous screen
        goBack()
      } else {

      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))   
    }
  }, [])

  

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
        
        // store user's info in the store
        const token = await getToken() 
        const user = await getUserInfos(API_ROOT, token)
        if(user) {
          dispatch(updateUser(user))
        }

        // Go back to the previous screen
        goBack()
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])


  console.log(userStore)


  return (
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={onGoogleAuthPress} />

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Sign In" onPress={onSignInPress} />

    </View>
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