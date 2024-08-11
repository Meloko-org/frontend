type ProductData = {
  _id: string
  name: string;
  image: string;
  description: string;
  family?: any;
}

type StockData = {
  _id: string
  price: { $numberDecimal: string }
  stock: { $numberDecimal: string }
  shop: {
    _id: string
    name: string
    markets: object[]
    clickCollect: object
  }
  product: ProductData
}

type CartData = {
  shop: ShopData
  products: [{
    product: StockData
    quantity: number
  }]
  withdrawMode: 'market' | 'clickCollect' | null | undefined
  market?: string
}


type ShopData = {
  _id: string
  name: string
  logo: string
  description: string
  markets: object[]
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
}

export type {
  ProductData,
  ShopData,
  UserData,
  StockData,
  CartData
}