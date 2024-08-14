import { Text, StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import CardProducer from '../../components/cards/ProducerSearchResult';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TextHeading2 from '../../components/utils/texts/Heading2';
import ButtonPrimaryStart from '../../components/utils/buttons/PrimaryStart';
export default function BookmarksScreen({ navigation }) {
  const userStore = useSelector((state: { user }) => state.user.value)

  const producersList = userStore && userStore.bookmarks.map((sr: ShopData) => {
    return (
    <CardProducer 
      shopData={sr}
      onPressFn={
        () => { 
          navigation.navigate('TabNavigatorUser', {
            screen: 'ShopUser',
            params: { 
              shopId: sr._id,
              distance: null,
              relevantProducts: [] 
            },
          }) 
        }
      }
      key={sr._id}
      extraClasses='mb-2'
      displayMode='bottomSheet'
    />

  )})

  return (
    <SafeAreaView className='flex-1 bg-lightbg dark:bg-darkbg'>
      <View className='p-3 flex flex-column h-full'>
        {
          producersList.length > 0 ? (
            <>
              <TextHeading2 extraClasses='mb-3'>Vos producteurs favoris</TextHeading2>
              <ScrollView showsVerticalScrollIndicator={false} className='flex-1 p-3'>
                { producersList }
              </ScrollView>
            </>
          ) : (
            <View className='h-full justify-center items-center'>
              <TextHeading2 extraClasses='mb-4'>Vous n'avez pas de favoris :(</TextHeading2>
              <ButtonPrimaryStart 
                label="Trouver un producteur" 
                iconName="arrow-left" 
                onPressFn={() => navigation.navigate('SearchCustomer') } 
                extraClasses='w-full'
              />
            </View>
          )
        }

      </View>

    
    </SafeAreaView>
  );
}
