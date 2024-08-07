import React from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeCustomerScreen({ navigation }: Props) {
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


  return (
    <View style={styles.container}>
      <Text>Map</Text>
      <Button title="Test" onPress={onTestPress} /> 
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