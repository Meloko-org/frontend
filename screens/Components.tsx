import React from 'react'
import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation'

import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Product from '../components/cards/Products';
import ProductCategory from './../components/cards/ProductCategory';
import Producer from '../components/cards/Producer';
import Status from '../components/cards/Status';
import Cancelled from '../components/utils/badges/Cancelled';
import Delivered from '../components/utils/badges/Delivered';
import Partial from '../components/utils/badges/Partial';
import PrimaryEnd from '../components/utils/buttons/PrimaryEnd';
import PrimaryStart from '../components/utils/buttons/PrimaryStart';
import SecondaryEnd from '../components/utils/buttons/SecondaryEnd';
import SecondaryStart from '../components/utils/buttons/SecondaryStart';
import Edit from '../components/utils/buttons/Edit';
import SimpleButton from '../components/utils/buttons/Icon';
import Simple from '../components/utils/inputs/Text';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ComponentsScreen({ navigation }: Props) {
 

  return (
<ScrollView contentContainerStyle={styles.UIcontainer}>
        <View className="flex-1 items-center justify-center p-3 overflow-y-auto">
        <View  className="mb-3">
          <TouchableOpacity ></TouchableOpacity>
        </View>
        
        <View  className="mb-3"></View>
          <Product></Product>
          <View  className="mb-3"></View>
          <ProductCategory></ProductCategory>
          <View  className="mb-3"></View>
          <Producer></Producer>
          <View  className="mb-3"></View>
          <Status></Status>
          <View  className="mb-3"></View>
          <Cancelled></Cancelled>
          <View  className="mb-3"></View>
          <Delivered></Delivered>
          <View  className="mb-3"></View>
          <Partial></Partial>
          <View  className="mb-3"></View>
          <PrimaryEnd name="Primary End Button"></PrimaryEnd>
          <View  className="mb-3"></View>
          <PrimaryStart name="Primary Start Button"></PrimaryStart>
          <View  className="mb-3"></View>
          <SecondaryEnd name="Secondary End Button"></SecondaryEnd>
          <View  className="mb-3"></View>
          <SecondaryStart name="Secondary Start Button"></SecondaryStart>
          <View  className="mb-3"></View>
          <View className="flex flex-row w-full">
            <Edit></Edit>
            <View  className="me-3"></View>
            <SimpleButton name="location-arrow"></SimpleButton>
            <View  className="me-3 w-7"></View>
          </View>
          <View  className="mb-3"></View>
          <Simple 
            name="test" 
            placeholder="placeholder" 
            label="label"
            autoCapitalize="none"
          ></Simple>
          <View  className="mb-3"></View>
          <View  className="mb-3"></View>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  UIcontainer: {
    backgroundColor: '#fFCFFF0'
  }
});