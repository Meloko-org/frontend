type OrderData = {
  _id: string;
  user: UserData;
  details: [
    {
      products: [
        {
          product: [StockData];
          quantity: number;
          isConfirmed: boolean;
        },
      ];
      withdrawMode: string;
      withdrawMarket: string;
      withdrawDay: string;
      market: MarketData;
      shop: ShopData;
      shopTotalPrice: number;
      status: string;
    },
  ];
  isWithdraw: boolean;
  isPaid: boolean;
  totalPrice: number;
  createdAt: Date;
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

type address = {
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
};

type MarketData = {
  _id: string;
  name: string;
  image: string;
  description: string;
  address: address;
};

type MarketsData = {
  market: MarketData;
  isActive: boolean;
  openingHours: OpeningHoursData[];
}[];

type StockData = {
  _id: string;
  price: { $numberDecimal: string };
  stock: { $numberDecimal: string };
  shop: ShopData;
  product: ProductData;
  tags: TagData[];
};

type TagData = {
  _id: string;
  name: string;
  description: string;
  color: string;
};

type CartData = {
  shop: ShopData;
  products: {
    stockData: StockData;
    quantity: number;
  }[];
  withdrawMode: "market" | "clickCollect" | null | undefined;
  withdrawMarket?: string | null;
  withdrawDay?: string | null;
  market?: MarketData;
};

type Note = {
  note: { $numberDecimal: string } | number | any;
  comment: string;
};

type ShopData = {
  _id: string;
  name: string;
  logo: string;
  description: string;
  address: AddressData;
  markets: MarketsData[];
  clickCollect: ClickCollectData;
  notes: Note[];
  products?: StockData[];
  [key: string]: any;
} | null;

type ClickCollectData =
  | {
      instructions: string;
      isActive: boolean;
      openingHours: OpeningHourData[];
    }
  | undefined;

type OpeningHoursData = {
  day: number;
  periods: PeriodData[];
}[];

type OpeningHourData =
  | {
      day: number;
      periods: PeriodData[];
    }
  | [];

type PeriodData = {
  openingTime: string;
  closingTime: string;
};

type AddressData = {
  address1: string | null;
  address2: String | null;
  postalCode: Number | null;
  city: String | null;
  country: String | null;
  latitude: Number | null;
  longitude: Number | null;
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
  address: AddressData;
} | null;

type ProductDetail = {
  product: string | StockData;
  quantity: number;
  isConfirmed: boolean | null;
};

// type de réponse de l'api
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message?: string;
};

export type {
  ProductData,
  ShopData,
  UserData,
  StockData,
  CartData,
  MarketData,
  MarketsData,
  OrderData,
  ProducerData,
  AddressData,
  ClickCollectData,
  OpeningHoursData,
  PeriodData,
  ProductDetail,
  ApiResponse,
  Note,
};
