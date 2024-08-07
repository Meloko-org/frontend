import React from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth()

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

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

      console.log(data)
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


  return (
    <View style={styles.container}>
      <Text>Home</Text>
      {
        isSignedIn ? (
          <>
            <Button title="Menu Producer" onPress={() => navigation.navigate('TabNavigatorProducer')} />
            <Button title="Test" onPress={onTestPress} /> 
            <Button title="Signout" onPress={onSignoutPress} /> 
          </>
        )
        : (
          <>
            <Button title="Signup" onPress={() => navigation.navigate('SignUp')} />
            <Button title="Signin" onPress={() => navigation.navigate('SignIn')} />
            <Button title="Menu User" onPress={() => navigation.navigate('TabNavigatorUser')} />
            <Button title="Shop" onPress={() => navigation.navigate('Shop')} />
            
          </>
        )
      }
      

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