import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation'
import TextHeading2 from '../../components/utils/texts/Heading2';
import { useSelector } from 'react-redux';
import CardOrder from '../../components/cards/Order';
import ButtonBack from '../../components/utils/buttons/Back';
import CardProducer from '../../components/cards/ProducerSearchResult';
import TextHeading3 from '../../components/utils/texts/Heading3';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';

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
      return (
        <View key={cco._id} className='my-2 flex items-center'>
          <TextHeading2 centered extraClasses='mb-2'>Click & Collect</TextHeading2>
          <ButtonPrimaryEnd 
            label="Itinéraire optimal"
            iconName='location-arrow'
            onPressFn={() => console.log("open google map")}
            extraClasses='w-80 mb-3'            
          />
          <CardProducer 
            shopData={cco.shop}
            withdrawData={cco.products}
            key={cco.shop._id}
            extraClasses='mb-1'
            displayMode='order'
            showDirectionButton
          />
        </View>
      )
    })

    marketOrdersDisplay = marketOrders.map(mo => {
      return (
        <View key={mo._id} className='my-2'>
          <TextHeading2 centered extraClasses='mb-2'>Marchés locaux</TextHeading2>
          <CardProducer 
            shopData={mo.shop}
            withdrawData={mo.products}
            key={mo.shop._id}
            extraClasses='mb-1'
            displayMode='order'
            showDirectionButton
          />
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

  const producersPerOrder = (producers) => {
    console.log(producers)
    const producersDisplay = producers.map(p => {
      return (
        <>
          <CardProducer 
            shopData={p.shop}
            key={p._id}
            displayMode='bottomSheet'
            extraClasses='mb-2'
          />
        </>

      )
    })

    return producersDisplay
  }

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
            <View className='p-3'>
              <ButtonBack 
                onPressFn={() => setIsOrderDetailModalVisible(false)}
              />
                {
                  selectedOrder && (
                    <>
                      <TextHeading2 extraClasses='mb-4'>{ `Commande n° ${selectedOrder._id.slice(0, 7)}`}</TextHeading2>

                      <ScrollView showsVerticalScrollIndicator={false}>
                        {clickCollectOrdersDisplay}
                        {marketOrdersDisplay}
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
