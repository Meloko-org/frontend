// Navigation types
// To keep synced with the Native Stack
type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  TabNavigatorUser: {
    screen:
      | "Search"
      | "Cart"
      | "Favoris"
      | "UserProfile"
      | "ShopUser"
      | "WithdrawModesUser"
      | "OrdersCustomer"
      | "PaymentCustomer"
      | "BookmarksCustomer"
      | "OrderCustomer";
  };
  TabNavigatorProducer: {
    screen:
      | "Homme"
      | "shop"
      | "BusinessCenter"
      | "ProducerProfile"
      | "Stocks"
      | "OrderDetails"
      | "Sales";
  };
  GestionDesStocks: undefined;
  ShopProducer: undefined;
  UserProfile: undefined;
  ProducerProfile: undefined;
  BusinessCenter: undefined;
  Sales: undefined;
  SearchCustomer: undefined;
  MapCustomer: undefined;
  PaymentCustomer: undefined;
  ShopUser: undefined;
  OrderCustomer: undefined;
  MarketsShopProducer: undefined;
};

export type { RootStackParamList };
