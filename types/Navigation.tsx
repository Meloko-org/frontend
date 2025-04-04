// Navigation types
// To keep synced with the Native Stack
type RootStackParamList = {
  Home: undefined;
  SignIn: { from?: string; backLabel?: string; screenTitle?: string };
  SignUp: { from: string; backLabel: string; screenTitle: string };
  TabNavigatorUser: undefined;
  TabNavigatorProducer: undefined;

  Search: undefined;
  Cart: undefined;
  Bookmarks: undefined;
  UserProfile: undefined;
  ShopUser: undefined;
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
  Stock: { from?: string; backLabel?: string; screenTitle?: string };
  PremiumOptions: { from?: string; backLabel?: string; screenTitle?: string };
  BusinessCenter: undefined;
  ProducerProfile: undefined;
  Stocks: undefined;
  OrderDetails: undefined;
  Sales: undefined;
};

export type { RootStackParamList };
