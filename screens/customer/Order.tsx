import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'

import TextHeading2 from '../../components/utils/texts/Heading2';
import TextHeading3 from '../../components/utils/texts/Heading3';
import TextHeading4 from '../../components/utils/texts/Heading4';
import TextBody1 from '../../components/utils/texts/Body1';
import CardProducer from '../../components/cards/ProducerSearchResult';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import CardProduct from '../../components/cards/Product';
type OrderScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderCustomer'
>;

type Props = {
  navigation: OrderScreenNavigationProp;
};

export default function SearchCustomerScreen({ route, navigation }: Props): JSX.Element {
  const userStore = useSelector((state: { user }) => state.user.value)
  const [newOrderDetails, setNewOrderDetails] = useState(null)

  useEffect(() => {
    const newOrder = userStore.orders.find(o => o._id === route.params.orderId)
    setNewOrderDetails(newOrder)
  }, [route.params])

  let clickCollectOrdersDisplay = <></>
  let marketOrdersDisplay = <></>

  if(newOrderDetails) {
    const clickCollectOrders = newOrderDetails.details.filter(d => d.withdrawMode === 'clickCollect')
    const marketOrders = newOrderDetails.details.filter(d => d.withdrawMode === 'market')
    
    clickCollectOrdersDisplay = clickCollectOrders.map(cco => {
      const productList = cco.products.map(p => {
        return  (
          <CardProduct
            stockData={{...p.product, notes: cco.shop.notes, quantity: p.quantity}}
            key={p.product._id}
            extraClasses='mb-1'
            displayMode='cart'
          />
        )         
      })


      return (
        <View key={cco._id} className='my-2 flex items-center'>
          <CardProducer 
            shopData={cco.shop}
            withdrawData={cco.products}
            key={cco.shop._id}
            extraClasses='mb-1'
            displayMode='order'
            showDirectionButton
            onPressFn={
              () => { 
                navigation.navigate('TabNavigatorUser', {
                  screen: 'ShopUser',
                  params: { 
                    shopId: cco.shop._id,
                    distance: null,
                    relevantProducts: [] 
                  },
                }) 
              }
            }
          />
          {productList}
        </View>
      )
    })

    marketOrdersDisplay = marketOrders.map(mo => {
      const productList = mo.products.map(p => {
        return  (
          <CardProduct
            stockData={{...p.product, notes: mo.shop.notes, quantity: p.quantity}}
            key={p.product._id}
            extraClasses='mb-1'
            displayMode='cart'
          />
        )         
      })
      return (
        <View key={mo._id} className='my-2'>
          <CardProducer 
            shopData={mo.shop}
            withdrawData={mo.products}
            key={mo.shop._id}
            extraClasses='mb-1'
            displayMode='order'
            showDirectionButton
            onPressFn={
              () => { 
                navigation.navigate('TabNavigatorUser', {
                  screen: 'ShopUser',
                  params: { 
                    shopId: mo.shop._id,
                    distance: null,
                    relevantProducts: [] 
                  },
                }) 
              }
            }
          />
          {productList}
        </View>
      )
    })

  }


  return (
    <SafeAreaView className='flex-1 bg-lightbg dark:bg-darkbg'>
      <View className='p-3'>
        <TextHeading2 extraClasses='mb-3'>Commande payée</TextHeading2>
        <TextBody1 centered extraClasses='mb-2'>Votre commande est maintenant payée. Vous recevrez un e-mail lorsqu'elle sera confirmée.</TextBody1>
        <TextHeading4 centered extraClasses='mb-4'>{`Commande n° ${route.params.orderId.slice(0, 7)}`}</TextHeading4>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='p-3'>
            {clickCollectOrdersDisplay}
            {marketOrdersDisplay}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
