type ShopData = {
  _id: string
  name: string;
  logo: string;
  description: string;
  notes: { note: { $numberDecimal: string } | number | any }[]; 
  product?: any;
  [key: string]: any;
}

type UserData = {
  email: string | null
  firstname: string | null
  lastname: string | null
  avatar: string | null
  bookmarks: object[] | null
  favSearch: object[] | null
}

export type {
  ShopData,
  UserData
}