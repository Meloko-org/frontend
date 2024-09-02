type OrderData = {
  _id: string;
  user: UserData;
  details: [
    {
      products: [StockData];
      withdrawMode: string;
      shop: ShopData;
    },
  ];
  isWithdraw: boolean;
  isPaid: boolean;
};

type ProductData = {
  _id: string;
  name: string;
  image: string;
  description: string;
  family?: any;
  weight: {
    unit: string;
    measurement: number;
  };
};

type MarketData = {
  _id: string;
  name: string;
  image: string;
  description: string;
  address: object;
  openingHours: object[];
};

type StockData = {
  _id: string;
  price: { $numberDecimal: string };
  stock: { $numberDecimal: string };
  shop: ShopData;
  product: ProductData;
};

type CartData = {
  shop: ShopData;
  products: [
    {
      product: StockData;
      quantity: number;
    },
  ];
  withdrawMode: "market" | "clickCollect" | null | undefined;
  market?: MarketData;
};

type ShopData = {
  _id: string;
  name: string;
  logo: string;
  description: string;
  address: AddressData;
  markets: MarketData[];
  clickCollect: object;
  notes: { note: { $numberDecimal: string } | number | any }[];
  products?: StockData[];
  [key: string]: any;
} | null;

type AddressData = {
  address1: string | null;
  address2: String | null;
  postalCode: Number | null;
  city: String | null;
  country: String | null;
};

type UserData = {
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  bookmarks: object[] | null;
  favSearch: object[] | null;
  orders: object[];
  clerkPasswordEnabled: boolean | null | undefined;
  producer: ProducerData | null;
};

type ProducerData = {
  socialReason: string | null;
  siren: number | null;
  owner: UserData;
  iban: string | null;
  address: Object | null;
};

export type {
  ProductData,
  ShopData,
  UserData,
  StockData,
  CartData,
  MarketData,
  OrderData,
  ProducerData,
  AddressData,
};
