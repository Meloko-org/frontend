import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, Modal, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import TextHeading2 from '../../components/utils/texts/Heading2';
import { useSelector } from 'react-redux';
import CardOrder from '../../components/cards/Order';
import ButtonBack from '../../components/utils/buttons/Back';
import CardProducer from '../../components/cards/ProducerSearchResult';
import TextHeading3 from '../../components/utils/texts/Heading3';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import CardProduct from '../../components/cards/Product';
import BadgeWithdrawStatus from '../../components/utils/badges/WithdrawStatus';

type OrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrdersCustomer'
>;

type Props = {
  navigation: OrdersScreenNavigationProp;
};

export default function OrdersCustomerScreen({ navigation }: Props): JSX.Element {
  const userStore = useSelector((state: { user: UserState }) => state.user.value);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)


  let clickCollectOrdersDisplay = <></>
  let marketOrdersDisplay = <></>

  if(selectedOrder) {
    const clickCollectOrders = selectedOrder.details.filter(d => d.withdrawMode === 'clickCollect')
    const marketOrders = selectedOrder.details.filter(d => d.withdrawMode === 'market')
    
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
                setIsOrderDetailModalVisible(false)
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
                setIsOrderDetailModalVisible(false)
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



  const handleOrderDetailPress = (order) => {
    setIsOrderDetailModalVisible(true)
    setSelectedOrder(order)
  }

  const orders = (userStore.orders && userStore.orders.length > 0) ? userStore.orders.map(o => { 
    return (
    <View key={o._id}>
      <CardOrder 
        orderData={o}
        extraClasses='mb-2'
        onPressFn={() => handleOrderDetailPress(o)}
      />
    </View>)
  }) : (
    <>
      <TextHeading2>Vous n'avez pas de commande :(</TextHeading2>
    </>
  )

  return (
    <SafeAreaView className='flex-1 bg-lightbg dark:bg-darkbg'>
      <View className='flex-1'>
      <TextHeading2 extraClasses="mb-5">Mes commandes</TextHeading2>

        <ScrollView className='flex-1'>

          <View  className='p-3'>
            {orders}
          </View>
          
        </ScrollView>
        
        <Modal visible={isOrderDetailModalVisible} animationType="slide" onRequestClose={() => setIsOrderDetailModalVisible(false)} className='p-3'>
          <SafeAreaView className='bg-lightbg flex-1 dark:bg-darkbg'>
            <View className='p-3 justify-center items-center'>
              <ButtonBack 
                onPressFn={() => setIsOrderDetailModalVisible(false)}
              />
                {
                  selectedOrder && (
                    <>
                      <TextHeading2 extraClasses='mb-1'>{ `Commande n° ${selectedOrder._id.slice(0, 7)}`}</TextHeading2>
                      <TextHeading3 extraClasses='mb-1' centered>{new Date(selectedOrder.createdAt).toLocaleString()}</TextHeading3>
                      <BadgeWithdrawStatus 
                        type={
                          selectedOrder.isWithdrawn ? 'full' : 'none'}
                          extraClasses='w-[100px] mb-4'
                      />
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View className='items-center'>
                        {clickCollectOrdersDisplay.length > 0 && (
                          <>
                            <TextHeading2 centered extraClasses='mb-2'>Click & Collect</TextHeading2>
                            <ButtonPrimaryEnd 
                              label="Itinéraire optimal"
                              iconName='location-arrow'
                              onPressFn={() => console.log("open google map")}
                              extraClasses='w-80 mb-3'            
                            />
                          </> 

                        )}
                        {clickCollectOrdersDisplay}
                        {marketOrdersDisplay.length > 0 && <TextHeading2 centered extraClasses='mb-2'>Marchés locaux</TextHeading2>}
                        {marketOrdersDisplay}
                        
                        </View>                        

                      </ScrollView>

                    </>

                  )

                }

            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  )
}
