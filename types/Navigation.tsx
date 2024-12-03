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
      | "Accueil"
      | "shop"
      | "BusinessCenter"
      | "ProducerProfile"
      | "Stocks";
  };
  GestionDesStocks: undefined;
  ShopProducer: undefined;
  UserProfile: undefined;
  ProducerProfile: undefined;
  SearchCustomer: undefined;
  MapCustomer: undefined;
  PaymentCustomer: undefined;
  ShopUser: undefined;
  OrderCustomer: undefined;
  MarketsShopProducer: undefined;
};

export type { RootStackParamList };
