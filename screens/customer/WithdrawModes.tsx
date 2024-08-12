import { SafeAreaView, View, Modal, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from "react";
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import { useDispatch, useSelector } from "react-redux";
import CardProduct from '../../components/cards/Product';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import InputRadioGroup from '../../components/utils/inputs/radioGroup';
import Market from '../../components/cards/Market';
import { updateWithdrawMode } from '../../reducers/cart'

export default function WithdrawModesScreen({ navigation }) {
  const dispatch = useDispatch()
  const cartStore = useSelector((state: { cart }) => state.cart.value)
  const [cartByShop, setCartByShop] = useState([])
  const [cartTotal, setCartTotal] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedMarkets, setSelectedMarkets] = useState([])
  const [isPaymentDisabledButton, setIsPaymentDisabledButton] = useState(false)

  useEffect(() => {
    if(cartStore.length > 0) {
      cartStore.forEach(c => {
        const cartTotalCost = c.products.reduce(
          (accumulator, currentValue) => {
            return (currentValue.quantity * Number(currentValue.stockData.price.$numberDecimal)) + accumulator },
          0,
        );
        setCartTotal(cartTotal + cartTotalCost)
      })
      setIsPaymentDisabledButton(cartStore.some(c => !c.withdrawMode))
    }
  }, [cartStore])

  const handleSelectedModePress = (shopName, value, market = null) => {
    const selectedShop = cartStore.find(c => c.shop.name === shopName)

    dispatch(updateWithdrawMode({shopId: selectedShop.shop._id, withdrawMode: value}))
    if(value === 'market') {
      setSelectedMarkets(selectedShop.shop.markets)
      setIsModalVisible(true) 
    } 
    
  }

  const products = cartStore.map(cart => {
    if(cart) {
      const productsByShop = cart.products.map(p => {
        return (
          <CardProduct
            stockData={p.stockData}
            key={p.stockData._id}
            extraClasses='mb-1'
            displayMode='cart'
            quantityControllable
            showImage
          />
        )
      })
      
      const withdrawModeButtonData = []
      
      cart.shop.markets.length > 0 && withdrawModeButtonData.push({
          label: 'Marchés locaux',
          value: 'market',
          selected: cart.withdrawMode === 'market' ? true : false
      })
  
      cart.shop.clickCollect && withdrawModeButtonData.push({
        label: 'Click & Collect',
        value: 'clickCollect',
        selected: cart.withdrawMode === 'clickCollect' ? true : false
      })
   
      return (
        <View className='mb-3'>
          <TextHeading3 centered extraClasses='mb-1'>{cart.shop.name}</TextHeading3> 
          <View className='flex flex-row justify-around mb-5'>
            <InputRadioGroup 
              data={withdrawModeButtonData}
              size='base'
              onPressFn={(value) => handleSelectedModePress(cart.shop.name, value)}
            />
          </View>
          {productsByShop}
        </View>
  
      )
    }

  })

  const handlePaymentPress = () => {
    console.log("pay")
  }

  const markets = selectedMarkets.map(m => {
    return (
      <Market key={m.name} name={m.name} />
    )
  })


  return (
    <SafeAreaView className='flex-1 bg-lightbg'>
      <View className='p-3'>
        <TextHeading2 extraClasses='mb-4'>Vos modes de retrait</TextHeading2>

        {products}
        <TextHeading3 extraClasses='py-3 text-right'>{`TOTAL: ${cartTotal}€`}</TextHeading3>
        <ButtonPrimaryEnd 
          disabled={isPaymentDisabledButton} 
          label="Passer au paiement" 
          iconName="arrow-right" 
          onPressFn={handlePaymentPress} 
        />
        
      </View>
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
          <SafeAreaView className='bg-lightbg flex-1'>
            <View className='p-3'>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className='mb-3'>
                <Text className='text-xl font-bold'>←</Text>
              </TouchableOpacity>
              <TextHeading2 extraClasses='mb-4'>Choisissez un marché</TextHeading2>
              {markets}
            </View>
          </SafeAreaView>
        </Modal>
    </SafeAreaView>
  );
}
