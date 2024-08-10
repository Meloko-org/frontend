import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'

import MapSearchBox from '../../components/map/MapSearchBox'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchCustomer'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SearchCustomerScreen({ navigation }: Props) {

  return (
    <MapSearchBox
      displayMode='fullview'
      navigation={navigation}
    />
  )
}
