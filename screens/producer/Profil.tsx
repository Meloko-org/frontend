import { useAuth } from '@clerk/clerk-expo'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UserState, updateUser } from '../../reducers/user';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'

/* Eléments graphiques */
import { View, SafeAreaView, ScrollView, Alert } from 'react-native';
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import TextBody1 from '../../components/utils/texts/Body1';
import TextBody2 from '../../components/utils/texts/Body2';
import Text from '../../components/utils/inputs/Text';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd'
import Custom from '../../components/utils/buttons/Custom';


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

  const switchUser = () => {
    navigation.navigate('TabNavigatorUser', {
      screen: 'Profil'
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">

      <View className="items-center w-full flex-1">
        
        <ScrollView className="w-full p-5">
          {/* <View className="p-5"> */}
            <TextHeading2 extraClasses="my-3">Profil Producteur</TextHeading2>

            <Text
              label="Raison sociale"
              placeholder="Saisissez votre raison sociale"
              value={socialReason}
              onChangeText={(value: string) => setSocialReason(value)}
              extraClasses='mb-2'
            />
            <Text
              label="SIREN"
              placeholder="Saisissez votre Siren"
              value={siren}
              onChangeText={(value: string) => setSiren(value)}
              extraClasses='mb-2'
            />
            <Text
              label="IBAN"
              placeholder="Saisissez votre Iban"
              value={iban}
              onChangeText={(value: string) => setIban(value)}
              extraClasses='mb-2'
            />
            <Text
              label="BIC"
              placeholder="Saisissez votre Bic"
              value={bic}
              onChangeText={(value: string) => setBic(value)}
              extraClasses='mb-2'
            />
            <TextHeading3 centered={true}>Adresse</TextHeading3>
            <Text
              label="Adresse"
              placeholder="Saisissez votre adresse"
              value={address.address1}
              onChangeText={(value: string) => setAddress({
                address1: value,
                address2: address.address2,
                postalCode: address.postalCode,
                city: address.city,
                country: address.country
              })}
              extraClasses='mb-2'
            />
            <Text
              label="Adresse complément"
              placeholder="Saisissez votre adresse"
              value={address.address2}
              onChangeText={(value: string) => setAddress({
                address1: address.address1,
                address2: value,
                postalCode: address.postalCode,
                city: address.city,
                country: address.country
              })}
              extraClasses='mb-2'
            />
            <Text
              label="Code Postal"
              placeholder="Saisissez le code postal"
              value={address.postalCode}
              onChangeText={(value: string) => setAddress({
                address1: address.address1,
                address2: address.address2,
                postalCode: value,
                city: address.city,
                country: address.country
              })}
              extraClasses='mb-2'
            />
            <Text
              label="Ville"
              placeholder="Saisissez la ville"
              value={address.city}
              onChangeText={(value: string) => setAddress({
                address1: address.address1,
                address2: address.address2,
                postalCode: address.postalCode,
                city: value,
                country: address.country
              })}
              extraClasses='mb-2'
            />
            <Text
              label="Pays"
              placeholder="Saisissez le pays"
              value={address.country}
              onChangeText={(value: string) => setAddress({
                address1: address.address1,
                address2: address.address2,
                postalCode: address.postalCode,
                city: address.city,
                country: value
              })}
              extraClasses='mb-2'
            />
            <ButtonPrimaryEnd
              label="Créer mon profil producteur" 
              iconName="arrow-right"
              disabled={false}
              onPressFn={() => handleProducerSave()} />
          {/* </View> */}
        </ScrollView>
          <Custom
            label="Basculer en mode Utilisateur"
            extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-5 px-5 h-[60px]"
            textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
            onPressFn={switchUser}
          />
      </View>
    </SafeAreaView>
  );
}