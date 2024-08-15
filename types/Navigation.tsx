// Navigation types
// To keep synced with the Native Stack
type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  TabNavigatorUser: {
    screen: 'Accueil' 
    | 'Panier'
    | 'Favoris'
    | 'Profil'
    | 'ShopUser'
    | 'WithdrawModesUser'
    | 'OrderCustomer'
    | 'PaymentCustomer'
    | 'BookmarksCustomer'
  };
  TabNavigatorProducer: {
    screen: 'Accueil' 
    | 'Boutique'
    | 'Business Center'
    | 'ProducerProfile'
  };
  GestionDesStocks: undefined;
  ShopProducer: undefined;
  ProfilProducer: undefined;
  SearchCustomer: undefined;
  MapCustomer: undefined; 
  ShopUser: undefined;
  OrderCustomer: undefined;
};

export type {
  RootStackParamList
}