// Navigation types
import { NavigatorScreenParams } from "@react-navigation/native";

import {
  ActivityData,
  ActivityPostData,
  CircuitOptionsData,
  NoteData,
  OrderData,
  PostThemeData,
  ProductCategoryData,
  ProductData,
  ShopCategoriesWithFamiliesData,
  StockData,
  UserAddressData,
} from "./API";

type ProducerTabParamList = {
  ShopProducer: undefined;
  ShopDetails: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
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
    onboarding?: boolean;
  };
  ShopWithdrawShopMarkets: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
  };
  ShopWithdrawShopMarketsSearch: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
  };
  ShopWithdrawShopMarketsManage: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
  };
  ShopWithdrawDelivery: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding?: boolean;
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
    onboarding?: boolean;
  };
  Stocks: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
    onboarding?: boolean;
  };
  StocksAdd: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
    onboarding?: boolean;
  };
  StocksEdit: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category?: string;
    family?: string;
    stockData?: StockData;
    productData?: ProductData;
    onboarding?: boolean;
  };
  PremiumOptions: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    programmedPosts?: string;
  };
  PostType: { from?: string; backLabel?: string; screenTitle?: string };
  ProgrammedPosts?: { from?: string; backLabel?: string; screenTitle?: string };
  PostParameters?: { from?: string; backLabel?: string; screenTitle?: string };
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
  CreatePost?: {
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
    from?: keyof ProducerTabParamList;
    backLabel?: string;
    screenTitle?: string;
    orderId: string;
  };
  ProducerContact: undefined;
};

/* simplification pour les tab navigators trop complexes comme producerTabParamList */
type SafeNavigatorParams<T> = {
  screen: keyof T;
  params?: any; // on laisse react-navigation faire le contrôle au runtime
};

type UserTabParamList = {
  MapCustomer: undefined;
  Cart: undefined;
  Bookmarks: undefined;
  UserProfile: undefined;
  UserProfileInformations: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  UserProfileAddresses: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    next?: string;
    selectAddressFn?: (address: UserAddressData) => void;
  };
  ShopUser: {
    shopId: string | undefined;
    distance: number | undefined;
    relevantProducts: StockData[] | [];
    sheetId: string | undefined;
  };
  WithdrawModes: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  OrderCustomer: {
    orderId: string;
  };
  PaymentCustomer: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };
  BookmarksCustomer: undefined;
  OrdersCustomer: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
  };

  CircuitParameters: undefined;
  CircuitMap: {
    circuitOptions: CircuitOptionsData;
  };
};

// To keep synced with the Native Stack
type RootStackParamList = {
  TabNavigatorUser: NavigatorScreenParams<UserTabParamList> | undefined;
  TabNavigatorProducer: SafeNavigatorParams<ProducerTabParamList> | undefined;
  Home: undefined;
  SignIn: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    next?: string;
  };
  SignUp: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    next?: string;
  };
  Sales: undefined;
  Onboarding0: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Onboarding5: undefined;
  OnboardingShopWithdrawModes: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingShopWithdrawClickcollect: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingShopWithdrawShopMarkets: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingShopWithdrawShopMarketsManage: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingShopWithdrawShopMarketsSearch: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingShopWithdrawDelivery: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingStockCategories: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    onboarding: true;
  };
  OnboardingStockFamilies: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    onboarding: boolean;
  };
  OnboardingStocks: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
    onboarding: true;
  };
  OnboardingStocksAdd: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category: string;
    family?: string;
    onboarding: true;
  };
  OnboardingStocksEdit: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    category?: string;
    family?: string;
    stockData?: StockData;
    productData?: ProductData;
    onboarding: true;
  };
  DisplayPdf: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    id: string;
  };
};

type Redirect =
  | { type: "root"; screen: keyof RootStackParamList }
  | { type: "userTab"; screen: keyof UserTabParamList; params?: any }
  | { type: "producerTab"; screen: keyof ProducerTabParamList }
  | { type: "onboarding"; screen: keyof RootStackParamList };

export type {
  RootStackParamList,
  ProducerTabParamList,
  UserTabParamList,
  Redirect,
};

/** typage de la nav selon que la screen est indépendante ou appartient à un tab

Tab: (producer)

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../navigation"; 

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


Tab et stack :

import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawModes"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawModes"
>;

** BottomTabScreenProps et NativeStackScreenProps donnent directement navigation + route **

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawModesScreen({ navigation, route }: Props) {
  const { onboarding } = route.params || {};
  // ...
}


Tab et stack avec param supplémentaires :


type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawShopMarketsManage"
> & {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawShopMarketsManage"
> & {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawShopMarketsManageScreen({
  navigation,
  route,
  isVisible,
  onCloseFn,
}: Props) {
  
  const { from, backLabel, screenTitle, onboarding } = route.params || {};



onPress sur les boutons : 

onPressFn={() => {
  if (onboarding) {
    (navigation as FromRootStack["navigation"]).navigate(
      "Onboarding***",
      {
        from: "Onboarding***",
        backLabel: "Retour ***",
        screenTitle: "***",
        onboarding: true,
      },
    );
  } else {
    (navigation as FromProducerTab["navigation"]).navigate(
      "***",
      {
        from: "***",
        backLabel: "Retour ***",
        screenTitle: "***",
      },
    );
  }
}}


Tab avec redirections vers stack et tab:

import { RouteProp } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ✅ Import de tes types centralisés
import { RootStackParamList, ProducerTabParamList } from "../navigation";

// On combine tab + stack
type ProducerProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<ProducerTabParamList, "ProducerProfile">,
  NativeStackNavigationProp<RootStackParamList>
>;

type ProducerProfileRouteProp = RouteProp<
  ProducerTabParamList,
  "ProducerProfile"
>;

type Props = {
  navigation: ProducerProfileNavProp;
  route: ProducerProfileRouteProp;
};


*/
