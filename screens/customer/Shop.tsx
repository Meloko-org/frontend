import { Text, Image, View, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation';
import { ShopData, ProductData, StockData } from '../../types/API';
import StarsNotation from '../../components/utils/StarsNotation';
import TextHeading2 from '../../components/utils/texts/Heading2';
import TextBody1 from '../../components/utils/texts/Body1';
import BadgeSecondary from '../../components/utils/badges/Secondary';
import ButtonIcon from '../../components/utils/buttons/Icon';
import ButtonPrimaryEnd from '../../components/utils/buttons/PrimaryEnd';
import CardProductSearchResult from '../../components/cards/ProductSearchResult';
import CardProductsAll from '../../components/cards/ProductsAll';
import ProductCategory from '../../components/cards/ProductCategory';

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

type StocksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShopUser'
>;

type Props = {
  navigation: StocksScreenNavigationProp;
  route: Route
};

type Params = {
  params: {
    shopId: string;
    relevantProducts: ProductData[];
  }
};

type Route = {
  params: Params
}

export default function ShopUserScreen({ route, navigation }: Props) {
  const [shopData, setShopData] = useState<ShopData>(null);
  const [searchProducts, setSearchProducts] = useState<StockData[]>([]);
  const [shopDistance, setShopDistance] = useState<number>(0)
  // const [shopStocks, setShopStocks] = useState<StockData[]>([]);
  // const [resultCategory, setResultCategory] = useState<{ word: string; count: number; }[]>([]);
  // const [shopProduct, setShopProduct] = useState<ProductData[]>([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<ProductData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

// Shop recovery
  useEffect(() => {
    const { shopId, relevantProducts, distance }: Route = route.params
    setShopDistance(distance.toFixed(2))

    if (relevantProducts.length > 0) {
      setSearchProducts(relevantProducts)
    }

    fetch(`${API_ROOT}/shops/${shopId}`) 
      .then(resp => resp.json())
      .then(data => {
        if (data.result) {
          setShopData(data.shop);
        }
      });
  }, [route.params]);

  const handleBookmarkPress = async ():Promise<void> => {
    console.log("bookmark")
  }

  const handleAllResultsPress =  async ():Promise<void> => {
    console.log("all results")
  }


  // Sorting products from categories by clicking
  const handleCategoryClick = (categoryName: string) => {
    const categoryData = shopData && shopData.categories.find(category => category.name === categoryName)
    // console.log("cat", categoryData)
    const filteredProducts = categoryData ? categoryData.products : [];
    setSelectedCategoryProducts(filteredProducts);
    console.log("filtered", filteredProducts)
    setIsModalVisible(true);
  };

  // Formatting category  
  const categories = shopData && shopData.categories.map((category, i) => {
    return (
      <ProductCategory category={category} onPressFn={() => handleCategoryClick(category.name)} key={category._id} />
    );
  });

  // Formatting search product  
  const searchProduct = searchProducts.map((p, i) => {
    return (
        <CardProductSearchResult 
          stockData={p}
          key={p._id}
          extraClasses='mb-1'
        />
    );
  });

  // Formatting shop product click
  const categoryProducts = selectedCategoryProducts.map((p, i) => {
    return (
      <CardProductsAll
        productData={p}
        key={p._id}
        extraClasses='mb-1'
      />
    );
  });

  
  return (
    <SafeAreaView className='flex-1 bg-lightbg'>
      <ScrollView className='p-3'>
        {
          shopData && (
            <View>
              <View>
              <TextHeading2 extraClasses='mb-4'>{shopData.name}</TextHeading2>
              <View className='flex flex-row items-center mb-3'>
                <View className='w-2/6'>
                  {shopData.logo ? (
                    <Image source={{ uri: shopData.logo }} resizeMode="cover" className='rounded-full'/>
                  ) : (
                    <Image source={require('../../assets/icon.png')} resizeMode="cover" width={112} height={112} className='w-28 h-28 rounded-full'/>
                  )}
                </View>
                <View className='flex flex-row justify-start w-3/6 h-full'>
                  <TextBody1>{shopData.description}</TextBody1>
                </View>
                <View className='w-1/6 h-full'>
                  <ButtonIcon 
                    iconName="heart"
                    extraClasses='h-16'
                    onPressFn={handleBookmarkPress}
                  />
                </View>
              </View>
            </View>


            <View className='flex flex-row w-full justify-evenly mb-3'>
              <StarsNotation iconNames={['star', 'star-half', 'star-o']} shopData={shopData}/>
              <BadgeSecondary uppercase>Click & collect</BadgeSecondary>
              <BadgeSecondary uppercase>Marché local</BadgeSecondary>
              <BadgeSecondary>{`${shopDistance}km`}</BadgeSecondary>
            </View>
          </View>
          )
        }




          {
            searchProduct.length > 0 && 
            (
              <View>
                  <TextHeading2>Votre recherche</TextHeading2>
                  <View className='my-4'>
                    {searchProduct} 
                  </View>
                  <ButtonPrimaryEnd label="Tous les résultats" iconName="arrow-right" onPressFn={handleAllResultsPress}></ButtonPrimaryEnd>
              </View>
            )
          }
          <View className='my-3'>
            <TextHeading2>Rayons</TextHeading2>
            <View className='my-3'>
              {categories}
            </View> 
          </View>
        
          <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
            <SafeAreaView className='bg-lightbg flex-1'>
              <View className='p-3'>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} className='mb-3'>
                  <Text className='text-xl font-bold'>←</Text>
                </TouchableOpacity>
                <TextHeading2 extraClasses='mb-4'>Tous les produits</TextHeading2>
                <ScrollView>
                  {categoryProducts}
                </ScrollView>
              </View>
            </SafeAreaView>
          </Modal>
      </ScrollView>    
    </SafeAreaView>
  );
}
