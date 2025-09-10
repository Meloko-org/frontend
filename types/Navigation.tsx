// Navigation types
import { NavigatorScreenParams } from "@react-navigation/native";

import {
  ActivityData,
  ActivityPostData,
  CircuitOptionsData,
  NoteData,
  PostThemeData,
  ProductCategoryData,
  ProductData,
  ShopCategoriesWithFamiliesData,
  StockData,
} from "./API";

type ProducerTabParamList = {
  ShopProducer: undefined;
  ShopDetails: { from?: string; backLabel?: string; screenTitle?: string };
  ShopOffline: { from?: string; backLabel?: string; screenTitle?: string };
  ShopParams: { from?: string; backLabel?: string; screenTitle?: string };
  ShopWithdrawModes: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
  };
  ShopWithdrawClickcollect: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  ShopWithdrawShopMarkets: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  ShopWithdrawShopMarketsSearch: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  ShopWithdrawShopMarketsManage: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  ShopWithdrawDelivery: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  StockCategories: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
  };
  StockFamilies: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
  };
  Stocks: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
  };
  StocksAdd: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
  };
  StocksEdit: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category?: string;
    family?: string;
    stockData?: StockData;
    productData?: ProductData;
  };
  PremiumOptions: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    programmedPosts?: string;
  };
  PostType: { from?: string; backLabel?: string; screenTitle?: string };
  ProgrammedPosts: { from?: string; backLabel?: string; screenTitle?: string };
  PostParameters: { from?: string; backLabel?: string; screenTitle?: string };
  ProductPostChoice: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  ActivityPostChoice: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  NoticePostChoice: { from?: string; backLabel?: string; screenTitle?: string };
  CreatePost: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    stock?: StockData;
    note?: NoteData;
    activity?: ActivityData;
  };
  PostPreview: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    postType: string;
    stock?: StockData;
    note?: NoteData;
    activity?: ActivityData;
    mediaUri?: string;
    productTags?: string[];
    theme: PostThemeData | null;
    networks: string[];
  };
  PostHistory: { from?: string; backLabel?: string; screenTitle?: string };
  PostNetworks: { from?: string; backLabel?: string; screenTitle?: string };
  PostFrequency: { from?: string; backLabel?: string; screenTitle?: string };
  PostHashtags: { from?: string; backLabel?: string; screenTitle?: string };
  BusinessCenter: undefined;
  PendingOrders: { from?: string; backLabel?: string; screenTitle?: string };
  ValidatedOrders: { from?: string; backLabel?: string; screenTitle?: string };
  WithdrawnOrders: { from?: string; backLabel?: string; screenTitle?: string };
  CanceledOrders: { from?: string; backLabel?: string; screenTitle?: string };
  AllOrders: { from?: string; backLabel?: string; screenTitle?: string };
  ProducerProfile: undefined;
  StocksOld: undefined;
  OrderDetails: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    orderId: string;
  };
};

type UserTabParamList = {
  MapCustomer: undefined;
  Cart: undefined;
  Bookmarks: undefined;
  UserProfile: undefined;
  UserProfileInformations: undefined;
  UserProfileAddresses: undefined;
  ShopUser: {
    shopId: string | undefined;
    distance: number | undefined;
    relevantProducts: StockData[];
    sheetId: string;
  };
  WithdrawModesUser: undefined;
  OrdersCustomer: undefined;
  PaymentCustomer: undefined;
  BookmarksCustomer: undefined;
  OrderCustomer: undefined;

  CircuitParameters: undefined;
  CircuitMap: {
    circuitOptions: CircuitOptionsData;
  };
};

// To keep synced with the Native Stack
type RootStackParamList = {
  TabNavigatorUser: NavigatorScreenParams<UserTabParamList> | undefined;
  TabNavigatorProducer: NavigatorScreenParams<ProducerTabParamList> | undefined;
  Home: undefined;
  SignIn: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    next: string;
  };
  SignUp: {
    from: string;
    backLabel: string;
    screenTitle: string;
  };
  Sales: undefined;
  Onboarding0: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Onboarding5: undefined;
};

export type { RootStackParamList, ProducerTabParamList, UserTabParamList };

/** typage de la nav selon que la screen est indépendante ou appartient à un tab

Tab: 

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../navigation"; // <-- ton fichier de types

type ShopWithdrawModesRouteProp = RouteProp<
  ProducerTabParamList,
  "ShopWithdrawModes"
>;

type ShopWithdrawModesNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "ShopWithdrawModes"
>;

type Props = {
  navigation: ShopWithdrawModesNavProp;
  route: ShopWithdrawModesRouteProp;
};

export default function ShopWithdrawModesScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};
  ...
}


Stack : 

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding5">;

export default function Onboarding5Screen({ navigation, route }: Props) {
  // route.params si besoin
  ...
}




*/
