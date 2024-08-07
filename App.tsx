import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './types/Navigation'

import _FontAwesome from 'react-native-vector-icons/FontAwesome6';

import HomeScreen from './screens/Home';
import SignUpScreen from './screens/Signup';
import SignInScreen from './screens/Signin';
import CartScreen from './screens/Cart';
import FavoritesScreen from './screens/Favorites';
import ProfilScreen from './screens/Profil';
import ShopScreen from './screens/producer/Shop';
import BusinessScreen from './screens/Business';
import ProducerProfileScreen from './screens/producer/Profil'
import ShopUserScreen from './screens/Shop'

const FontAwesome = _FontAwesome as React.ElementType;

// Create a Natrive Stack Navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigator screen options
const options: NativeStackNavigationOptions = {
  headerShown: false,
};

// Create the secure cache to store the Clerk JWT token
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

// Import the Clerk publishable key
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

const TabNavigatorUser: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = '';

        if (route.name === 'Accueil') {
          iconName = 'house';
        } else if (route.name === 'Panier') {
          iconName = 'cart-shopping';
        } else if (route.name === 'Favoris') {
          iconName = 'heart';
        } else if (route.name === 'Profil') {
          iconName = 'user-circle';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#98B66E',
      tabBarInactiveTintColor: '#262E20',
      headerShown: false,
    })}>
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Panier" component={CartScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

const TabNavigatorProducer: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = '';

        if (route.name === 'Accueil') {
          iconName = 'house';
        } else if (route.name === 'Boutique') {
          iconName = 'shop';
        } else if (route.name === 'Business Center') {
          iconName = 'file-invoice-dollar';
        } else if (route.name === 'ProducerProfile') {
          iconName = 'user-circle';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#98B66E',
      tabBarInactiveTintColor: '#262E20',
      headerShown: false,
    })}>
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Boutique" component={ShopScreen} />
      <Tab.Screen name="Business Center" component={BusinessScreen} />
      <Tab.Screen name="ProducerProfile" component={ProducerProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <NavigationContainer>
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="TabNavigatorUser" component={TabNavigatorUser} />
            <Stack.Screen name="TabNavigatorProducer" component={TabNavigatorProducer} />
            <Stack.Screen name="Shop" component={ShopUserScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}