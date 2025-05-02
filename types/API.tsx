type OrderData = {
  _id: string;
  user: UserData;
  details: [
    {
      _id: string;
      products: [
        {
          _id: string;
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
      shopTotalPrice: { $numberDecimal: string };
      status: string;
    },
  ];
  isWithdraw: boolean;
  isPaid: boolean;
  totalPrice: { $numberDecimal: string };
  createdAt: Date;
};

type ProductData = {
  _id: string;
  name: string;
  image: string;
  description: string;
  family: ProductFamilyData;
  weight: WeightData;
};

type ProductType = "bulk" | "classic" | "both";

type ProductFamilyData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  productsTypes: ProductType[];
  category: ProductCategoryData;
  tagCategories: string[];
};

type ProductCategoryData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  type: string;
};

type ProductsTypesByCategory = {
  categoryName: string;
  productsTypes: string[];
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
  productCustomName: string;
  price: { $numberDecimal: string };
  pricePerKilo: { $numberDecimal: string };
  stock: { $numberDecimal: string };
  shop: ShopData;
  product: ProductData;
  weightPerUnit: string;
  origin: string;
  format: string;
  portion: string;
  bestBeforeDate: string;
  description: string;
  image: string;
  tags: TagData[];
};

type TagData = {
  _id: string;
  name: string;
  description: string;
};

type TagCategoryData = {
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
  producer: ProducerData;
  name: string;
  siret: string;
  logo: string;
  shortDesc: string;
  longDesc: string;
  photos: string[];
  videos: string[];
  isOpen: boolean;
  reopenDate: Date;
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
  latitude?: Number | null;
  longitude?: Number | null;
};

type UserAddressData = {
  _id?: string;
  name: String;
  address: AddressData;
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
  addresses: UserAddressData[] | null;
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

type WeightData = {
  unit: string;
  measurement: { $numberDecimal: string };
};

// type de réponse de l'api
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message?: string;
};

type OrderSummary = {
  _id: string;
  createdAt: string;
  user: {
    firstname: string;
    lastname: string;
  };
  detail: {
    status: string;
    shopTotalPrice: { $numberDecimal: string };
  };
};

export type {
  UserAddressData,
  ProductData,
  ShopData,
  UserData,
  StockData,
  TagData,
  TagCategoryData,
  CartData,
  MarketData,
  MarketsData,
  OrderData,
  ProducerData,
  ProductFamilyData,
  ProductCategoryData,
  ProductsTypesByCategory,
  AddressData,
  ClickCollectData,
  OpeningHoursData,
  PeriodData,
  ProductDetail,
  WeightData,
  ApiResponse,
  Note,
  OrderSummary,
};
