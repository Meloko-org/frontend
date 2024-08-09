import React, { useState } from 'react'
import { StyleSheet, TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};



export default function SignUpScreen({ navigation: { goBack } }: Props) {


  // Import the Clerk signup functions
  const { isLoaded, signUp, setActive } = useSignUp()

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // Email verification status
  const [pendingVerification, setPendingVerification] = useState<boolean>(false)
  // Email verification code
  const [code, setCode] = useState<string>('')




  const onSignUpPress = async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return
    }

    try {
      // Try to signup
      await signUp.create({
        emailAddress,
        password,
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
        // redirection vers la page compte user pour saisie nom, prénom...
        // -> enregistrement des nouvelles infos (nom, prénom) dans le store 
        // Go back to the previous screen
        goBack()
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
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