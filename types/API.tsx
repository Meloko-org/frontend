type ProductData = {
  _id: string
  name: string;
  image: string;
  description: string;
  family?: any;
}

type MarketData = {
  _id: string
  name: string;
  image: string;
  description: string;
  address: object
  openingHours: object[]
}


type StockData = {
  _id: string
  price: { $numberDecimal: string }
  stock: { $numberDecimal: string }
  shop: ShopData
  product: ProductData
}

type CartData = {
  shop: ShopData
  products: [{
    product: StockData
    quantity: number
  }]
  withdrawMode: 'market' | 'clickCollect' | null | undefined
  market?: MarketData
}


type ShopData = {
  _id: string
  name: string
  logo: string
  description: string
  markets: MarketData[]
  clickCollect: object
  notes: { note: { $numberDecimal: string } | number | any }[]
  products?: StockData[]
  [key: string]: any
} | null

type UserData = {
  email: string | null
  firstname: string | null
  lastname: string | null
  avatar: string | null
  bookmarks: object[] | null
  favSearch: object[] | null
  orders: object[]
  ClerkPasswordEnabled: boolean | null
}

export type {
  ProductData,
  ShopData,
  UserData,
  StockData,
  CartData,
  MarketData
}