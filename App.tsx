import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Product from './components/cards/Products';
import ProductCategory from './components/cards/ProductCategory';
import Producer from './components/cards/Producer';
import Status from './components/cards/Status';

export default function App(): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-white p-3">
      <Text>Open up App.tsx to start working on your app!</Text>
      <Product></Product>
      <View  className="mb-3"></View>
      <ProductCategory></ProductCategory>
      <View  className="mb-3"></View>
      <Producer></Producer>
      <View  className="mb-3"></View>
      <Status></Status>
      <View  className="mb-3"></View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
});
