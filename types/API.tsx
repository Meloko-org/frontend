type OrderData = {
  _id: string;
  user: UserData;
  details: [
    {
      _id: string;
      products: [
        {
          _id: string;
          product: StockData;
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
  stripePIId: string;
  totalPrice: number;
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

type CardProductData = {
  stockData: StockData;
  quantity: number;
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

// type ProductCategoryCardData = ProductCategoryData & {
//   products?: ProductData[];
// };

type ProductCategoryCardData = {
  category: ProductCategoryData;
  stocks: StockData[];
};

type ProductsTypesByCategory = {
  categoryName: string;
  productsTypes: string[];
};

type address = {
  address1: string;
  address2: string | null;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
};

type MarketData = {
  _id: string;
  name: string;
  image: string;
  description: string;
  address: AddressData;
};

// type MarketsData = {
//   market: MarketData;
//   isActive: boolean;
//   openingHours: OpeningHoursData[];
// };

type MarketsData = {
  _id: string;
  market: MarketData;
  isActive: boolean;
  openingHours: OpeningHourData[];
};

type MarketResultData = {
  market: MarketData;
  shops: (ShopData & { matchedStocks: StockData[] })[];
  distance: number;
};

type StockData = {
  _id: string;
  productCustomName: string;
  price: number;
  pricePerKilo: number;
  stock: number;
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
  isDeleted: boolean;
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
  withdrawMode: "market" | "clickCollect" | "shipping" | null | undefined;
  withdrawMarket?: string | null;
  withdrawDay?: number | null;
  market?: MarketData;
};

type NoteData = {
  _id: string;
  note: number | number | any;
  user: UserData;
  shop: string;
  comment: string;
  source: string;
  photo: string | null;
  createdAt: Date;
};

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  image: string;
  type: string;
};

type FullShopData = {
  shop: ShopData;
  categories: {
    category: CategoryData;
    stocks: StockData[];
  }[];
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
  types: TypeData[];
  isOpen: boolean;
  reopenDate: Date;
  address: AddressData;
  markets: MarketsData[];
  marketsPreviouslyActive: string[];
  clickCollect: ClickCollectData;
  notes: NoteData[];
  isPremium: boolean;
  crew: CrewMember[];
  products?: StockData[];
  socials: NetworksData;
  socialPostSettings?: SocialPostSettingsData;
  features: ShopFeaturesData[];
  [key: string]: any;
} | null;

type TypeData = {
  _id: string;
  name: string;
  image: string;
  description: string;
};

type CrewMember = {
  forname: string;
  role: string;
  description: string;
  photo: string;
};

type SocialNetworkData = {
  connected: boolean;
  isEnabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  username?: string;
  pageId?: string; // utile pour Facebook
  pageName?: string; // utile pour Facebook
  expiresAt?: string | null; // Date sous forme de string ISO
};

type NetworksData = {
  instagram: SocialNetworkData;
  facebook: SocialNetworkData;
  tiktok: SocialNetworkData;
};

type SocialPostSettingsData = {
  frequency: {
    mode: "manual" | "reminder";
    timesPerWeek: number;
    preferredDays: string[]; // ex: ["monday", "friday"]
  };
  customHashtags: string[];
  customMentions: string[];
};

type ShopResultData = {
  shop: ShopData;
  relevantProducts: StockData[];
  distance?: number;
};

// type ClickCollectData =
//   | {
//       instructions: string;
//       isActive: boolean;
//       openingHours: OpeningHourData[];
//     }
//   | undefined;

// type OpeningHoursData = {
//   day: number;
//   periods: PeriodData[];
// }[];

// type OpeningHourData =
//   | {
//       day: number;
//       periods: PeriodData[];
//     }
//   | [];

type PeriodData = {
  openingTime: string | null;
  closingTime: string | null;
};

type OpeningHourData = {
  day: number;
  periods: PeriodData[];
};

type ClickCollectData = {
  instructions: string;
  isActive: boolean;
  openingHours: OpeningHourData[];
};

type AddressData = {
  address1: string | null;
  address2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  latitude?: number;
  longitude?: number;
};

type UserAddressData = {
  _id?: string;
  name: String;
  address: AddressData;
};

type UserData = {
  _id: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  bookmarks: ShopData[] | null;
  favSearch: object[] | null;
  orders: object[];
  clerkPasswordEnabled: boolean | null | undefined;
  producer: ProducerData | null;
  addresses: UserAddressData[] | null;
};

type ProducerData = {
  _id: string;
  socialReason: string | null;
  siren: string | null;
  owner: UserData;
  iban: string | null;
  bic: string | null;
  address: AddressData;
  onboardingStep: number;
} | null;

type ProductDetail = {
  product: StockData;
  quantity: number;
  isConfirmed: boolean | null;
};

type WeightData = {
  unit: string;
  measurement: number;
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
    shopTotalPrice: number;
  };
};

type ShopCategoriesWithFamiliesData = {
  category: ProductCategoryData;
  families: {
    family: ProductFamilyData;
    isClassic: boolean;
  }[];
};

type PostThemeData = {
  _id: string;
  title: string;
  promptKey: string;
  promptContext: string;
  type: string;
  order: number;
};

type GeneratedPostData = {
  _id: string;
  stock: StockData;
  shop: string;
  title: string;
  generatedText: string;
  imageUrl: string;
  networks: string[];
  theme: string;
  productTags: string[];
  globalTags: string[];
  globalMentions: string[];
  createdAt: Date;
};

type ValidatePostValues = {
  subjectType: string;
  stock: string | null;
  note: string | null;
  activity: string | null;
  title: string;
  type: string;
  imageUrl: string;
  generatedText: string;
  editedText: string;
  productTags: string[];
  globalTags: string[];
  globalMentions: string[];
  networks: string[];
  isScheduled: boolean;
  generatedId: string;
};

type ValidatePostData = {
  _id: string;
  subjectType: string;
  shop: string;
  stock: string;
  note: string;
  activity: string;
  title: string;
  imageUrl: string;
  generatedText: string;
  editedText: string;
  productTags: string[];
  globalTags: string[];
  globalMentions: string[];
  networks: string[];
  scheduledFor: Date | null;
  publishedAt: Date | null;
  status: string;
  errorMessage: string;
};

type ActivityData = {
  _id: string;
  productType: TypeData;
  title: string;
  promptKey: string;
  promptContext: string;
  isActive: boolean;
};

type ActivityPostData = {
  title: string;
  data: ActivityData[];
};

type UserPositionData = {
  latitude: number | undefined;
  longitude: number | undefined;
};

type CircuitOptionsData = {
  types: string[];
  address: string;
  radius: {
    value: number[];
  };
  userPosition: UserPositionData;
  duration: string;
  features: string[];
};

type ShopFeaturesData = {
  _id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
};

type CircuitParamsData = {
  shops: ShopData[];
  avgRating: string;
  polyline: string;
  totalDistance: string;
  totalDuration: string;
};

/* types spéciaux pour la création ou l'update des produits en fonction du type bulk ou classic */

// bulk / création
type CreateBulkStockPayload = {
  price: number;
  stock: number;
  product: ProductData;
  description: string;
  tags: TagData[];
};

// bulk / update
type UpdateBulkStockPayload = CreateBulkStockPayload & { _id: string };

// classic / création
type CreateClassicStockPayload = {
  productCustomName: string;
  price: number;
  pricePerKilo: number;
  stock: number;
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

// classic / update
type UpdateClassicStockPayload = CreateClassicStockPayload & { _id: string };

type CreateStockPayload = CreateBulkStockPayload | CreateClassicStockPayload;
type UpdateStockPayload = UpdateBulkStockPayload | UpdateClassicStockPayload;

export type {
  UserAddressData,
  ProductData,
  CardProductData,
  CategoryData,
  FullShopData,
  ShopData,
  CrewMember,
  SocialNetworkData,
  NetworksData,
  SocialPostSettingsData,
  ShopResultData,
  UserData,
  StockData,
  TagData,
  TagCategoryData,
  CartData,
  MarketData,
  MarketsData,
  MarketResultData,
  OrderData,
  ProducerData,
  ProductFamilyData,
  ProductCategoryData,
  ProductCategoryCardData,
  ProductsTypesByCategory,
  AddressData,
  ClickCollectData,
  OpeningHourData,
  PeriodData,
  ProductDetail,
  WeightData,
  ApiResponse,
  NoteData,
  OrderSummary,
  ShopCategoriesWithFamiliesData,
  PostThemeData,
  GeneratedPostData,
  ValidatePostValues,
  ValidatePostData,
  ActivityData,
  ActivityPostData,
  UserPositionData,
  CircuitOptionsData,
  ShopFeaturesData,
  CircuitParamsData,
  CreateBulkStockPayload,
  UpdateBulkStockPayload,
  CreateClassicStockPayload,
  UpdateClassicStockPayload,
  CreateStockPayload,
  UpdateStockPayload,
};
