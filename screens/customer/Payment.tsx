import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import { useDispatch, useSelector } from "react-redux";
import StripePaymentButton from '../../components/utils/buttons/StripePayment';
import InputText from "../../components/utils/inputs/Text";
import TextHeading2 from "../../components/utils/texts/Heading2";
import InputTextarea from "../../components/utils/inputs/Textarea";
type PaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentCustomer'
>;

type Props = {
  navigation: PaymentScreenNavigationProp;
};

export default function PaymentCustomerScreen({ navigation }: Props): JSX.Element {
  const cartStore = useSelector((state: { cart }) => state.cart.value)
  const userStore = useSelector((state: { user }) => state.user.value)
  const [cartTotal, setCartTotal] = useState<number>(0)
  const [user, setUser] = useState({})

  
  useEffect(() => {
    setUser({...userStore})
  }, [])

  useEffect(() => {
      let allShopsCost = 0
      cartStore.forEach(c => {
        const cartTotalCost = c.products.reduce(
          (accumulator, currentValue) => {
            return (currentValue.quantity * Number(currentValue.stockData.price.$numberDecimal)) + accumulator },
          0,
        );
        allShopsCost += cartTotalCost
        
      })
      setCartTotal(allShopsCost)
  }, [cartStore])

  return (
    <SafeAreaView className="bg-lightbg flex-1">
      <View className="p-3">
        <TextHeading2 extraClasses="mb-3">Facturation</TextHeading2>
        <InputText
          value={user.firstname}
          onChangeText={(newFirstname: string) => setUser((prevState) => ({
            ...prevState,
            firstname: newFirstname
          }))}

          placeholder="Votre prénom" 
          label="Prénom"
          autoCapitalize="none"
          extraClasses="w-full mb-2"
        />

        <InputText
          value={user.lastname}
          onChangeText={(newLastname: string) => setUser((prevState) => ({
            ...prevState,
            lastname: newLastname
          }))}
          placeholder="Votre nom" 
          label="Nom"
          autoCapitalize="none"
          extraClasses="w-full mb-2"
        />

        <InputText
          value={user.address}
          onChangeText={(newAddress: string) => setUser((prevState) => ({
            ...prevState,
            address: newAddress
          }))}
          placeholder="Votre adresse" 
          label="Adresse"
          autoCapitalize="none"
          extraClasses="w-full mb-2"
        />

        <StripePaymentButton 
          label="Payer"
          iconName="credit-card"
          user={user}
          totalCartAmount={cartTotal}
          navigation={navigation}
          disabled={!user.firstname || !user.lastname}
        />
      </View>

    </SafeAreaView>
  )
}
