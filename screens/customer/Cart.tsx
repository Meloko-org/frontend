import { SafeAreaView, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from "react";
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/cart";
import CardProduct from '../../components/cards/Product';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import ButtonPrimaryStart from '../../components/utils/buttons/PrimaryStart';
import ButtonSecondaryStart from '../../components/utils/buttons/SecondaryStart';
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
      <View className='mb-3' key={cart.shop._id}>
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
    <SafeAreaView className='flex-1 bg-lightbg dark:bg-darkbg'>

      <View className='p-3 flex flex-column h-full'>
        
        {
          products.length > 0 ? (
            <>
              <TextHeading2 extraClasses='mb-4'>Votre panier</TextHeading2>
              <ScrollView>
                {products}
                <TextHeading3 extraClasses='py-3 text-right'>{`TOTAL: ${cartTotal.toFixed(2)}€`}</TextHeading3>

                <ButtonPrimaryEnd label="Mes modes de retrait" iconName="arrow-right" onPressFn={handleWithdrawModePress} extraClasses='mb-3' />

                <ButtonSecondaryStart 
                  label="Continuer vos achats" 
                  iconName="arrow-left" 
                  onPressFn={() =>     navigation.navigate('TabNavigatorUser', {
                    screen: 'Accueil',
                    params: {
                      search: {}
                    }
                  }) } 
                  
                />
              </ScrollView>

            </>
          ) : (
            <View className='h-full justify-center items-center'>
              <TextHeading2 extraClasses='mb-4'>Votre panier est vide :(</TextHeading2>
              <ButtonPrimaryStart label="Continuer vos achats" iconName="arrow-left" onPressFn={() => navigation.goBack()} extraClasses='w-full'/>
            </View>

          )
        }
      </View>
    </SafeAreaView>
  );
}
