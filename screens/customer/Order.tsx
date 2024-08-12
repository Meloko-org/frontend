import React from 'react'
import { SafeAreaView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextBody1 from '../../components/utils/texts/Body1';
type OrderScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderCustomer'
>;

type Props = {
  navigation: OrderScreenNavigationProp;
};

export default function SearchCustomerScreen(props, { navigation }: Props): JSX.Element {

  return (
    <SafeAreaView className='flex-1 bg-lightbg'>
      <View className='p-3'>
        <TextHeading2>Commande payée</TextHeading2>
        <TextBody1>Votre commande est maintenant payée. Vous recevrez un e-mail lorsqu'elle sera confirmée.</TextBody1>
      </View>
    </SafeAreaView>
  )
}
