// Navigation types
// To keep synced with the Native Stack
type RootStackParamList = {
  Home: undefined;
  SignIn: { from?: string; backLabel?: string; screenTitle?: string };
  SignUp: { from: string; backLabel: string; screenTitle: string };
  TabNavigatorUser: {
    screen:
      | "Search"
      | "Cart"
      | "Bookmarks"
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
      | "Home"
      | "Shop"
      | "BusinessCenter"
      | "ProducerProfile"
      | "Stocks"
      | "OrderDetails"
      | "Sales";
  };
  SearchCustomer: undefined;
  // GestionDesStocks: undefined;
  // ShopProducer: undefined;
  // UserProfile: undefined;
  // ProducerProfile: undefined;
  // BusinessCenter: undefined;
  // Sales: undefined;
  // MapCustomer: undefined;
  // PaymentCustomer: undefined;
  // ShopUser: undefined;
  // OrderCustomer: undefined;
  // MarketsShopProducer: undefined;
};

export type { RootStackParamList };
