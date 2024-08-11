import { SafeAreaView, View, Modal, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from "react";
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import { useDispatch, useSelector } from "react-redux";
import CardProduct from '../../components/cards/Product';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import InputRadioGroup from '../../components/utils/inputs/radioGroup';
import Market from '../../components/cards/Market';

export default function WithdrawModesScreen({ navigation }) {
  const dispatch = useDispatch()
  const cartStore = useSelector((state: { cart }) => state.user.cart)
  const [cartByShop, setCartByShop] = useState([])
  const [cartTotal, setCartTotal] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedMarkets, setSelectedMarkets] = useState([])
  const [isPaymentDisabledButton, setIsPaymentDisabledButton] = useState(false)
  useEffect(() => {
    if(cartStore.length > 0) {
      const cartTotalCost = cartStore.reduce(
        (accumulator, currentValue) => {
          return (currentValue.quantity * Number(currentValue.stockData.price.$numberDecimal)) + accumulator },
        0,
      );
      
      setCartTotal(cartTotalCost.toFixed(2))
      const shops = []
      cartStore.forEach(data => {
        const existingShop = shops.find(s => s.name === data.stockData.shop.name)
        if(existingShop) {
          existingShop.stockDatas.push(data.stockData)
        } else {
          shops.push({
            name: data.stockData.shop.name,
            markets: data.stockData.shop.markets,
            clickCollect: data.stockData.shop.clickCollect,
            stockDatas: [data.stockData],
            withdrawMode: data.withdrawMode
          })
        }
        
        
      })
      setCartByShop(shops)
    }
  }, [cartStore])

  useEffect(() => {
    setIsPaymentDisabledButton(cartByShop.some(cbs => !cbs.withdrawMode))
  }, [cartByShop])

  const handleSelectedModePress = (shopName, value, market = null) => {
    let selectedShop
    const shops = cartByShop.map(s => {
      if(s.name === shopName) {
        selectedShop = s
        return {
          ...s,
          withdrawMode: value
        }
      } else  {
        return s
      }
    })

    
    setCartByShop(shops)

    if(value === 'market') {
      setSelectedMarkets(selectedShop.markets)
      setIsModalVisible(true) 
    } 
    
  }

  const products = cartByShop && cartByShop.map(data => {
    if(data) {
      const productsByShop = data.stockDatas.map(stockData => {
        return (
          <CardProduct
            stockData={stockData}
            key={stockData._id}
            extraClasses='mb-1'
            displayMode='cart'
          />
        )
      })
      
      const withdrawModeButtonData = []
      
      data.markets.length > 0 && withdrawModeButtonData.push({
          label: 'Marchés locaux',
          value: 'market',
          selected: data.withdrawMode === 'market' ? true : false
      })
  
      data.clickCollect && withdrawModeButtonData.push({
        label: 'Click & Collect',
        value: 'clickCollect',
        selected: data.withdrawMode === 'clickCollect' ? true : false
      })
   
      return (
        <View className='mb-3'>
          <TextHeading3 centered extraClasses='mb-1'>{data.name}</TextHeading3> 
          <View className='flex flex-row justify-around mb-5'>
            <InputRadioGroup 
              data={withdrawModeButtonData}
              size='base'
              onPressFn={(value) => handleSelectedModePress(data.name, value)}
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
