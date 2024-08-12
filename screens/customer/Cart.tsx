import { SafeAreaView, View } from 'react-native';
import React, { useState, useEffect } from "react";
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/cart";
import CardProduct from '../../components/cards/Product';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import ButtonPrimaryStart from '../../components/utils/buttons/PrimaryStart';

export default function CartScreen({ navigation }) {
  const cartStore = useSelector((state: { cart }) => state.cart.value)
  const [cartTotal, setCartTotal] = useState<number>(0)

  useEffect(() => {
    if(cartStore.length > 0) {
      let allShopsCost = 0
      cartStore.forEach(c => {
        const cartTotalCost = c.products.reduce(
          (accumulator, currentValue) => {
            return (currentValue.quantity * Number(currentValue.stockData.price.$numberDecimal)) + accumulator },
          0,
        );
        console.log("c total cost", cartTotalCost)
        allShopsCost += cartTotalCost
        
      })
      setCartTotal(allShopsCost)
    }
  }, [cartStore])

  const products = cartStore.map(cart => {
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
 
    return (
      <View className='mb-3'>
        <TextHeading3 centered extraClasses='mb-3'>{cart.shop.name}</TextHeading3> 
        {productsByShop}
      </View>

    )
  })

  const handleWithdrawModePress = () => {
    navigation.navigate('TabNavigatorUser', {
      screen: 'WithdrawModesUser',
    }) 
  }


  return (
    <SafeAreaView className='flex-1 bg-lightbg'>
      <View className='p-3'>
        <TextHeading2 extraClasses='mb-4'>Votre panier</TextHeading2>
        {
          products.length > 0 ? (
            <>
              {products}
              <TextHeading3 extraClasses='py-3 text-right'>{`TOTAL: ${cartTotal}€`}</TextHeading3>
              <ButtonPrimaryStart label="Continuer vos achats" iconName="arrow-left" onPressFn={handleWithdrawModePress} extraClasses='mb-3' />
              <ButtonPrimaryEnd label="Mes modes de retrait" iconName="arrow-right" onPressFn={handleWithdrawModePress} />
            </>
          ) : (
            <View className='h-full flex flex-column justify-center items-center w-full'>
              <TextHeading2 extraClasses='mb-4'>Votre panier est vide :(</TextHeading2>
              <ButtonPrimaryStart label="Continuer vos achats" iconName="arrow-left" onPressFn={() => navigation.goBack()} extraClasses='w-full'/>
            </View>

          )
        }
      </View>
    </SafeAreaView>
  );
}
