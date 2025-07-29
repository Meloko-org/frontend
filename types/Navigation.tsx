// Navigation types

import {
  PostThemeData,
  ProductCategoryData,
  ProductData,
  ShopCategoriesWithFamiliesData,
  StockData,
} from "./API";

// To keep synced with the Native Stack
type RootStackParamList = {
  Home: undefined;
  SignIn: { from?: string; backLabel?: string; screenTitle?: string };
  SignUp: { from: string; backLabel: string; screenTitle: string };
  TabNavigatorUser: undefined;
  TabNavigatorProducer: undefined;

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

  ShopProducer: undefined;
  ShopDetails: { from?: string; backLabel?: string; screenTitle?: string };
  ShopOffline: { from?: string; backLabel?: string; screenTitle?: string };
  ShopParams: { from?: string; backLabel?: string; screenTitle?: string };
  ShopWithdrawModes: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
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
  StockCategories: { from?: string; backLabel?: string; screenTitle?: string };
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
    shopCategoriesWithFamilies: ShopCategoriesWithFamiliesData[];
  };
  ActivityPost: { from?: string; backLabel?: string; screenTitle?: string };
  NoticePostChoice: { from?: string; backLabel?: string; screenTitle?: string };
  CreatePost: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    shopCategoriesWithFamilies: ShopCategoriesWithFamiliesData[];
    stock: StockData;
  };
  PostPreview: {
    from?: string;
    backLabel?: string;
    screenTitle?: string;
    shopCategoriesWithFamilies: ShopCategoriesWithFamiliesData[];
    stock: StockData;
    productTags: string[];
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
  Sales: undefined;
};

export type { RootStackParamList };
