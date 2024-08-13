import { Text, StyleSheet, View, TextInput, Button } from 'react-native';
import React, { useState } from "react";
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfilProducer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfilProducerScreen({ navigation }: Props) {
  // Import the Clerk Auth functions
  const { getToken } = useAuth()


  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  const [socialReason, setSocialReason] = useState<string>('')
  const [siren, setSiren] = useState<string>('')
  const [iban, setIban] = useState<string>('')
  const [bic, setBic] = useState<string>('')
  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    postalCode: '',
    city: '',
    country: ''
  })

  const handleProducerSave = async () => {
    try {
      const token = await getToken()
      const response = await fetch(`${API_ROOT}/producers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          mode: 'cors',
        },
        body: JSON.stringify({
          socialReason,
          siren,
          iban,
          bic,
          address
        })
      })
      const data = await response.json()

    } catch(error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texte}>Profil</Text>
      <TextInput
        value={socialReason}
        placeholder="Raison social"
        onChangeText={(value) => setSocialReason(value)}
      />
      <TextInput
        value={siren}
        placeholder="SIREN"
        onChangeText={(value) => setSiren(value)}
      />
      <TextInput
        value={iban}
        placeholder="IBAN"
        onChangeText={(value) => setIban(value)}
      />
      <TextInput
        value={bic}
        placeholder="BIC"
        onChangeText={(value) => setBic(value)}
      />
      <Text style={styles.texte}>Adresse</Text>
      <TextInput
        value={address.address1}
        placeholder="Adresse"
        onChangeText={(value) => setAddress({
          address1: value,
          address2: address.address2,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country
        })}
      />
      <TextInput
        value={address.address2}
        placeholder="Complément"
        onChangeText={(value) => setAddress({
          address1: address.address1,
          address2: value,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country
        })}
      />
      <TextInput
        value={address.postalCode}
        placeholder="Code postal"
        onChangeText={(value) => setAddress({
          address1: address.address1,
          address2: address.address2,
          postalCode: value,
          city: address.city,
          country: address.country
        })}
      />
      <TextInput
        value={address.city}
        placeholder="Ville"
        onChangeText={(value) => setAddress({
          address1: address.address1,
          address2: address.address2,
          postalCode: address.postalCode,
          city: value,
          country: address.country
        })}
      />
      <TextInput
        value={address.country}
        placeholder="Pays"
        onChangeText={(value) => setAddress({
          address1: address.address1,
          address2: address.address2,
          postalCode: address.postalCode,
          city: address.city,
          country: value
        })}
      />
      <Button title="Créer mon profil producteur" onPress={() => handleProducerSave()} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    texte: {
        textAlign: 'center',
        marginTop: '70%'
  },
});