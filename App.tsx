import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { ModalProvider } from "./context/ModalContext";
import { SheetManager, SheetProvider } from "react-native-actions-sheet";
import "./components/bottomSheets/sheets";

import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import { navigationRef } from "./navigation/navigationRef";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  RootStackParamList,
  ProducerTabParamList,
  UserTabParamList,
} from "./types/Navigation";

import _FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useFonts, Caveat_400Regular } from "@expo-google-fonts/caveat";
import { Caveat_500Medium } from "@expo-google-fonts/caveat/500Medium";
import { Caveat_600SemiBold } from "@expo-google-fonts/caveat/600SemiBold";
import { Caveat_700Bold } from "@expo-google-fonts/caveat/700Bold";

import { useColorScheme } from "nativewind";

/* STACK screens */
import HomeScreen from "./screens/Home";
import SignUpScreen from "./screens/Signup";
import SignInScreen from "./screens/Signin";
import Onboarding0Screen from "./screens/Onboarding0";
import Onboarding1Screen from "./screens/Onboarding1";
import Onboarding2Screen from "./screens/Onboarding2";
import Onboarding3Screen from "./screens/Onboarding3";
import Onboarding4Screen from "./screens/Onboarding4";
import Onboarding5Screen from "./screens/Onboarding5";
import DisplayPdfScreen from "./screens/DisplayPdf";
import StocksOldScreen from "./screens/Stocks";
import ComponentsScreen from "./screens/Components";
/* Tab USER screens */
import MapCustomerScreen from "./screens/customer/Map";
import CartScreen from "./screens/customer/Cart";
import CircuitParametersScreen from "./screens/customer/CircuitParameters";
import CircuitMapScreen from "./screens/customer/CircuitMap";
import BookmarksScreen from "./screens/customer/Bookmarks";
import UserProfileScreen from "./screens/customer/Profile";
import UserProfileInformationsScreen from "./screens/customer/ProfileInformations";
import UserProfileAddressesScreen from "./screens/customer/ProfileAddresses";
import ShopUserScreen from "./screens/customer/Shop";
import WithdrawModesScreen from "./screens/customer/WithdrawModes";
import OrderCustomerScreen from "./screens/customer/Order";
import PaymentCustomerScreen from "./screens/customer/Payment";
import OrdersCustomerScreen from "./screens/customer/Orders";
/* Tab PRODUCER screens*/
import ShopProducerScreen from "./screens/producer/Shop";
import BusinessCenterScreen from "./screens/producer/BusinessCenter";
import PendingOrdersScreen from "./screens/producer/PendingOrders";
import ValidatedOrdersScreen from "./screens/producer/ValidatedOrders";
import WithdrawnOrdersScreen from "./screens/producer/WithdrawnOrders";
import CanceledOrdersScreen from "./screens/producer/CanceledOrders";
import AllOrdersScreen from "./screens/producer/AllOrders";
import ProducerProfileScreen from "./screens/producer/Profile";
import ShopDetailsScreen from "./screens/producer/ShopDetails";
import PremiumOptionsScreen from "./screens/producer/PremiumOptions";
import ShopOfflineScreen from "./screens/producer/ShopOffline";
import ShopParamsScreen from "./screens/producer/ShopParams";
import ShopWithdrawModesScreen from "./screens/producer/ShopWithdrawModes";
import StockCategoriesScreen from "./screens/producer/StockCategories";
import StockFamiliesScreen from "./screens/producer/StockFamilies";
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
import PostHistoryScreen from "./screens/producer/PostHistory";
import ProductPostChoiceScreen from "./screens/producer/ProductPostChoice";
import ActivityPostChoiceScreen from "./screens/producer/ActivityPostChoice";
import NoticePostChoiceScreen from "./screens/producer/NoticePostChoice";
import CreatePostScreen from "./screens/producer/CreatePost";
import PostPreviewScreen from "./screens/producer/PostPreview";
import PostNetworksScreen from "./screens/producer/PostNetworks";
import PostFrequencyScreen from "./screens/producer/PostFrequency";
import PostHashtagsScreen from "./screens/producer/PostHashtags";
import OrderDetailsScreen from "./screens/producer/OrderDetails";
import StocksEditScreen from "./screens/producer/StockEdit";
import ProducerContactScreen from "./screens/producer/ProducerContact";

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
import stocks from "./reducers/stocks";
import producer from "./reducers/producer";
import orders from "./reducers/orders";
import mapShopResults from "./reducers/mapShopResults";
import mapMarketResults from "./reducers/mapMarketResults";
import { SafeAreaProvider } from "react-native-safe-area-context";

import React, { useEffect } from "react";
import { AuthProvider, useAuthContext } from "./hooks/useAuthContext";

import * as WebBrowser from "expo-web-browser";

// Warm up the android browser to improve UX
// https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const reducers = combineReducers({
  user,
  cart,
  mode,
  shop,
  producer,
  stocks,
  orders,
  mapShopResults,
  mapMarketResults,
});
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

const FontAwesome = _FontAwesome as unknown as React.ElementType;

// Create a Natrive Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
// const Tab = createBottomTabNavigator<RootStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();
const ProducerTab = createBottomTabNavigator<ProducerTabParamList>();

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
  const { isSignedIn } = useAuthContext();
  const { colorScheme } = useColorScheme();
  const tabBarBackgroundColor = colorScheme === "dark" ? "#444C3D" : "#FFF";

  // récupère le nom de la screen courante
  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  return (
    <UserTab.Navigator
      screenOptions={({ route }) => ({
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "MapCustomer") {
            iconName = "search";
          } else if (route.name === "CircuitParameters") {
            iconName = "car";
          } else if (route.name === "Cart") {
            iconName = "shopping-basket";
          } else if (route.name === "Bookmarks") {
            iconName = "heart";
          } else if (route.name === "UserProfile") {
            iconName = "user-circle";
          }

          return (
            <FontAwesome name={iconName} size={size} color={color} solid />
          );
        },
        tabBarActiveTintColor: "#98B66E",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#FCFFF0" : "#262E20",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
        },
      })}
    >
      <UserTab.Screen name="MapCustomer" component={MapCustomerScreen} />

      {/* Onglet protégé */}
      <UserTab.Screen
        name="CircuitParameters"
        component={CircuitParametersScreen}
        options={{ title: "Circuit" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isSignedIn) {
              e.preventDefault();
              SheetManager.show("signin-required", {
                payload: {
                  context: "circuit",
                  from: currentRouteName,
                  next: "CircuitParameters",
                },
              });
            }
          },
        })}
      />

      <UserTab.Screen name="Cart" component={CartScreen} />

      {/* Onglet protégé */}
      <UserTab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{ title: "Favoris" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isSignedIn) {
              e.preventDefault();
              SheetManager.show("signin-required", {
                payload: {
                  context: "bookmarks",
                  from: currentRouteName,
                  next: "Bookmarks",
                },
              });
            }
          },
        })}
      />

      {/* Onglet protégé */}
      <UserTab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: "compte" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isSignedIn) {
              e.preventDefault();
              SheetManager.show("signin-required", {
                payload: {
                  context: "profile",
                  from: currentRouteName,
                  next: "UserProfile",
                },
              });
            }
          },
        })}
      />

      <UserTab.Screen
        name="CircuitMap"
        component={CircuitMapScreen}
        options={{ tabBarButton: () => null }}
      />

      <UserTab.Screen
        name="UserProfileInformations"
        component={UserProfileInformationsScreen}
        options={{ tabBarButton: () => null }}
      />
      <UserTab.Screen
        name="UserProfileAddresses"
        component={UserProfileAddressesScreen}
        options={{ tabBarButton: () => null }}
      />

      <UserTab.Screen
        name="ShopUser"
        component={ShopUserScreen}
        options={{ tabBarButton: () => null }}
      />
      <UserTab.Screen
        name="WithdrawModes"
        component={WithdrawModesScreen}
        options={{ tabBarButton: () => null }}
      />
      <UserTab.Screen
        name="OrderCustomer"
        component={OrderCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
      <UserTab.Screen
        name="PaymentCustomer"
        component={PaymentCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
      <UserTab.Screen
        name="OrdersCustomer"
        component={OrdersCustomerScreen}
        options={{ tabBarButton: () => null }}
      />
    </UserTab.Navigator>
  );
};

const TabNavigatorProducer: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const tabBarBackgroundColor = colorScheme === "dark" ? "#444C3D" : "#FFF";

  return (
    <ProducerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "";

          if (route.name === "ProducerContact") {
            iconName = "phone-alt";
          } else if (route.name === "ShopProducer") {
            iconName = "store";
          } else if (route.name === "BusinessCenter") {
            iconName = "file-invoice-dollar";
          } else if (route.name === "ProducerProfile") {
            iconName = "user-circle";
          }

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
      <ProducerTab.Screen
        name="ProducerContact"
        component={ProducerContactScreen}
      />
      <ProducerTab.Screen name="ShopProducer" component={ShopProducerScreen} />
      <ProducerTab.Screen
        name="BusinessCenter"
        component={BusinessCenterScreen}
      />
      <ProducerTab.Screen
        name="ProducerProfile"
        component={ProducerProfileScreen}
      />

      <ProducerTab.Screen
        name="ShopDetails"
        component={ShopDetailsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopOffline"
        component={ShopOfflineScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopParams"
        component={ShopParamsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopWithdrawModes"
        component={ShopWithdrawModesScreen}
        options={{ tabBarButton: () => null }}
      />

      <ProducerTab.Screen
        name="ShopWithdrawClickcollect"
        component={ShopWithdrawClickcollectScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopWithdrawShopMarkets"
        component={ShopWithdrawShopMarketsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopWithdrawShopMarketsSearch"
        component={ShopWithdrawShopMarketsSearchScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopWithdrawShopMarketsManage"
        component={ShopWithdrawShopMarketsManageScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ShopWithdrawDelivery"
        component={ShopWithdrawDeliveryScreen}
        options={{ tabBarButton: () => null }}
      />

      <ProducerTab.Screen
        name="StockCategories"
        component={StockCategoriesScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="StockFamilies"
        component={StockFamiliesScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="StocksAdd"
        component={StocksAddScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="StocksEdit"
        component={StocksEditScreen}
        options={{ tabBarButton: () => null }}
      />

      <ProducerTab.Screen
        name="PremiumOptions"
        component={PremiumOptionsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostType"
        component={PostTypeScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ProductPostChoice"
        component={ProductPostChoiceScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ActivityPostChoice"
        component={ActivityPostChoiceScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="NoticePostChoice"
        component={NoticePostChoiceScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostPreview"
        component={PostPreviewScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ProgrammedPosts"
        component={ProgrammedPostsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostParameters"
        component={PostParametersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostNetworks"
        component={PostNetworksScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostFrequency"
        component={PostFrequencyScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostHistory"
        component={PostHistoryScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PostHashtags"
        component={PostHashtagsScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="PendingOrders"
        component={PendingOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="ValidatedOrders"
        component={ValidatedOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="WithdrawnOrders"
        component={WithdrawnOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="CancelledOrders"
        component={CanceledOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="AllOrders"
        component={AllOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <ProducerTab.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ tabBarButton: () => null }}
      />
    </ProducerTab.Navigator>
  );
};

export default function App() {
  useWarmUpBrowser();

  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
    Caveat_500Medium,
    Caveat_600SemiBold,
    Caveat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={publishableKey}
          >
            <AuthProvider>
              <ClerkLoaded>
                <SafeAreaProvider>
                  <SheetProvider>
                    <NavigationContainer ref={navigationRef}>
                      <Stack.Navigator screenOptions={options}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="SignIn" component={SignInScreen} />
                        <Stack.Screen
                          name="Onboarding0"
                          component={Onboarding0Screen}
                        />
                        <Stack.Screen
                          name="Onboarding1"
                          component={Onboarding1Screen}
                        />
                        <Stack.Screen
                          name="Onboarding2"
                          component={Onboarding2Screen}
                        />
                        <Stack.Screen
                          name="Onboarding3"
                          component={Onboarding3Screen}
                        />
                        <Stack.Screen
                          name="Onboarding4"
                          component={Onboarding4Screen}
                        />
                        <Stack.Screen
                          name="Onboarding5"
                          component={Onboarding5Screen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawModes"
                          component={ShopWithdrawModesScreen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawClickcollect"
                          component={ShopWithdrawClickcollectScreen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawShopMarkets"
                          component={ShopWithdrawShopMarketsScreen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawShopMarketsManage"
                          component={ShopWithdrawShopMarketsManageScreen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawShopMarketsSearch"
                          component={ShopWithdrawShopMarketsSearchScreen}
                        />
                        <Stack.Screen
                          name="OnboardingShopWithdrawDelivery"
                          component={ShopWithdrawDeliveryScreen}
                        />
                        <Stack.Screen
                          name="OnboardingStocks"
                          component={StocksScreen}
                        />
                        <Stack.Screen
                          name="OnboardingStocksAdd"
                          component={StocksAddScreen}
                        />
                        <Stack.Screen
                          name="OnboardingStocksEdit"
                          component={StocksEditScreen}
                        />
                        <Stack.Screen
                          name="OnboardingStockCategories"
                          component={StockCategoriesScreen}
                        />
                        <Stack.Screen
                          name="OnboardingStockFamilies"
                          component={StockFamiliesScreen}
                        />
                        <Stack.Screen
                          name="DisplayPdf"
                          component={DisplayPdfScreen}
                        />
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
                </SafeAreaProvider>
              </ClerkLoaded>
            </AuthProvider>
          </ClerkProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
