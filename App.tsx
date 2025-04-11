import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { ModalProvider } from "./context/ModalContext";
import { SheetProvider } from "react-native-actions-sheet";
import "./components/bottomSheets/sheets";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types/Navigation";

import _FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useColorScheme } from "nativewind";

import HomeScreen from "./screens/Home";
import MapCustomerScreen from "./screens/customer/Map";
import SignUpScreen from "./screens/Signup";
import SignInScreen from "./screens/Signin";
import CartScreen from "./screens/customer/Cart";
import BookmarksScreen from "./screens/customer/Bookmarks";
import UserProfileScreen from "./screens/customer/Profile";
import UserProfileInformationsScreen from "./screens/customer/ProfileInformations";
import ShopProducerScreen from "./screens/producer/Shop";
import BusinessScreen from "./screens/Business";
import ProducerProfileScreen from "./screens/producer/Profile";
import StocksOldScreen from "./screens/Stocks";
import SearchCustomerScreen from "./screens/customer/Search";
import ComponentsScreen from "./screens/Components";
import ShopUserScreen from "./screens/customer/Shop";
import WithdrawModesUserScreen from "./screens/customer/WithdrawModes";
import OrderCustomerScreen from "./screens/customer/Order";
import PaymentCustomerScreen from "./screens/customer/Payment";
import OrdersCustomerScreen from "./screens/customer/Orders";
import SalesScreen from "./screens/Sales";
import ShopDetailsScreen from "./screens/producer/ShopDetails";
import PremiumOptionsScreen from "./screens/producer/PremiumOptions";
import ShopOfflineScreen from "./screens/producer/ShopOffline";
import ShopParamsScreen from "./screens/producer/ShopParams";
import ShopWithdrawModesScreen from "./screens/producer/ShopWithdrawModes";
import StockCategoriesScreen from "./screens/producer/StockCategories";
import StocksScreen from "./screens/producer/Stocks";
import StocksAddScreen from "./screens/producer/StocksAdd";
import ShopWithdrawClickcollectScreen from "./screens/producer/ShopWithdrawClickcollect";
import ShopWithdrawDeliveryScreen from "./screens/producer/ShopWithdrawDelivery";
import ShopWithdrawShopMarketsScreen from "./screens/producer/ShopWithdrawShopMarkets";
import ShopWithdrawShopMarketsManageScreen from "./screens/producer/ShopWithdrawShopMarketsManage";
import ShopWithdrawShopMarketsSearchScreen from "./screens/producer/ShopWithdrawShopMarketsSearch";
import PostTypeScreen from "./screens/producer/PostType";
import ProgrammedPostsScreen from "./screens/producer/ProgrammedPosts";
import PostParametersScreen from "./screens/producer/PostParameters";
import ProductPostChoiceScreen from "./screens/producer/ProductPostChoice";
import ActivityPostScreen from "./screens/producer/ActivityPost";
import NoticePostChoiceScreen from "./screens/producer/NoticePostChoice";
import CreatePostScreen from "./screens/producer/CreatePost";
import PostPreviewScreen from "./screens/producer/PostPreview";
import PostNetworksScreen from "./screens/producer/PostNetworks";
import PostFrequencyScreen from "./screens/producer/PostFrequency";
import PostHashtagsScreen from "./screens/producer/PostHashtags";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
// import storage from "redux-persist/lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./reducers/user";
import cart from "./reducers/cart";
import mode from "./reducers/mode";
import shop from "./reducers/shop";
import producer from "./reducers/producer";
import OrderDetailsScreen from "./screens/OrderDetails";

const reducers = combineReducers({ user, cart, mode, shop, producer });
const persistConfig = {
  key: "meloko",
  storage: AsyncStorage,
  whitelist: ["mode"],
};
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const FontAwesome = _FontAwesome as React.ElementType;

// Create a Natrive Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Navigator screen options
const options: NativeStackNavigationOptions = {
  headerShown: false,
};

// Create the secure cache to store the Clerk JWT token
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Import the Clerk publishable key
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

const TabNavigatorUser: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const tabBarBackgroundColor = colorScheme === "dark" ? "#444C3D" : "#FFF";
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Cart") {
            iconName = "shopping-basket";
          } else if (route.name === "BookmarksCustomer") {
            iconName = "heart";
          } else if (route.name === "UserProfile") {
            iconName = "user-circle";
          }

          return (
            <FontAwesome name={iconName} size={size} color={color} solid />
          );
        },
        tabBarActiveTintColor: "#98B66E",
        tabBarInactiveTintColor: "#262E20",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Search" component={MapCustomerScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen
        name="BookmarksCustomer"
        component={BookmarksScreen}
        options={{ title: "Favoris" }}
      />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />
      <Tab.Screen
        name="UserProfileInformations"
        component={UserProfileInformationsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopUser"
        component={ShopUserScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="WithdrawModesUser"
        component={WithdrawModesUserScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="OrderCustomer"
        component={OrderCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PaymentCustomer"
        component={PaymentCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="OrdersCustomer"
        component={OrdersCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

const TabNavigatorProducer: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const tabBarBackgroundColor = colorScheme === "dark" ? "#444C3D" : "#FFF";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "ShopProducer") {
            iconName = "store";
          } else if (route.name === "BusinessCenter") {
            iconName = "file-invoice-dollar";
          } else if (route.name === "ProducerProfile") {
            iconName = "user-circle";
          } // else if (route.name === "Stocks") {
          //   iconName = "boxes";
          // }

          return (
            <FontAwesome name={iconName} size={size} color={color} solid />
          );
        },
        tabBarActiveTintColor: "#98B66E",
        tabBarInactiveTintColor: "#262E20",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ShopProducer" component={ShopProducerScreen} />
      <Tab.Screen
        name="ShopDetails"
        component={ShopDetailsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopOffline"
        component={ShopOfflineScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopParams"
        component={ShopParamsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawModes"
        component={ShopWithdrawModesScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawClickcollect"
        component={ShopWithdrawClickcollectScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawShopMarkets"
        component={ShopWithdrawShopMarketsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawShopMarketsSearch"
        component={ShopWithdrawShopMarketsSearchScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawShopMarketsManage"
        component={ShopWithdrawShopMarketsManageScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ShopWithdrawDelivery"
        component={ShopWithdrawDeliveryScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="StockCategories"
        component={StockCategoriesScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="StocksAdd"
        component={StocksAddScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PremiumOptions"
        component={PremiumOptionsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostType"
        component={PostTypeScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ProductPostChoice"
        component={ProductPostChoiceScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ActivityPost"
        component={ActivityPostScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="NoticePostChoice"
        component={NoticePostChoiceScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostPreview"
        component={PostPreviewScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ProgrammedPosts"
        component={ProgrammedPostsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostParameters"
        component={PostParametersScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostNetworks"
        component={PostNetworksScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostFrequency"
        component={PostFrequencyScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="PostHashtags"
        component={PostHashtagsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen name="BusinessCenter" component={BusinessScreen} />
      <Tab.Screen name="ProducerProfile" component={ProducerProfileScreen} />

      <Tab.Screen
        name="Sales"
        component={SalesScreen}
        options={{ tabBarButton: () => null }}
      />
      {/* <Tab.Screen
        name="StocksOld"
        component={StocksOldScreen}
        options={{ tabBarButton: () => null }}
      /> */}
      <Tab.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={publishableKey}
          >
            <ClerkLoaded>
              <SheetProvider>
                <NavigationContainer>
                  <Stack.Navigator screenOptions={options}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen
                      name="SearchCustomer"
                      component={SearchCustomerScreen}
                    />
                    {/* <Stack.Screen
                        name="Components"
                        component={ComponentsScreen}
                        /> */}
                    <Stack.Screen
                      name="TabNavigatorUser"
                      component={TabNavigatorUser}
                    />
                    <Stack.Screen
                      name="TabNavigatorProducer"
                      component={TabNavigatorProducer}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </SheetProvider>
            </ClerkLoaded>
          </ClerkProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
