type ProductData = {
  _id: string
  name: string;
  image: string;
  description: string;
  family?: any;
  stock?: { $numberDecimal: string }
  price?: { $numberDecimal: string }
}

type StockData = {
  price: number
  stock: number
  product: ProductData
}

type ShopData = {
  _id: string
  name: string;
  logo: string;
  description: string;
  notes: { note: { $numberDecimal: string } | number | any }[]; 
  product?: ProductData[];
  [key: string]: any;
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
  StockData
}