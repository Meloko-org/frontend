import { SafeAreaView, View } from 'react-native';
import React, { useState, useEffect } from "react";
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/user";
import CardProduct from '../../components/cards/Product';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';

export default function CartScreen() {
  const cartStore = useSelector((state: { cart }) => state.user.cart)
  const [cartByShop, setCartByShop] = useState([])
  const [cartTotal, setCartTotal] = useState<number>(0)

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
        const existingShop = shops.find(cbs => cbs.name === data.stockData.shop.name)
        if(existingShop) {
          existingShop.stockDatas.push(data.stockData)
        } else {
          shops.push({
            name: data.stockData.shop.name,
            stockDatas: [data.stockData]
          })
        }
        
        
      })
      setCartByShop(shops)
    }

  }, [cartStore])

  const products = cartByShop && cartByShop.map(data => {
    console.log('cart', data.stockDatas[0].stock)
    const productsByShop = data.stockDatas.map(stockData => {
          return (
            <CardProduct
              stockData={stockData}
              key={stockData._id}
              extraClasses='mb-1'
            />
          )
        })
 
    return (
      <View className='mb-3'>
        <TextHeading3 centered extraClasses='mb-3'>{data.name}</TextHeading3> 
        {productsByShop}
      </View>

    )
  })

  const handlePaymentPress = () => {
    console.log("pay")
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
              <ButtonPrimaryEnd label="Mes modes de retrait" iconName="arrow-right" onPressFn={handlePaymentPress} />
            </>
          ) : (
            <View className='h-full flex flex-column justify-center items-center'>
              <TextHeading2 extraClasses='mb-4'>Votre panier est vide :(</TextHeading2>
              <ButtonPrimaryEnd label="Continuer vos achats" iconName="arrow-right" onPressFn={handlePaymentPress} />
            </View>

          )
        }
        

      </View>
    </SafeAreaView>
  );
}
