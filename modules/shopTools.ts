import { ShopData, MarketData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const createOrUpdateShop = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

type Period = {
  openingTime: string | null;
  closingTime: string | null;
};
type OpeningHour = {
  day: number;
  periods: Period[];
};
type ClickCollectValues = {
  instructions: string | undefined;
  openingHours: OpeningHour[];
} | null;

const updateClickCollect = async (
  token: string | null,
  values: ClickCollectValues,
) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/clickCollect`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

type AddShopMarketsData = {
  shopId: string | undefined;
  marketIds: string[];
};

// permet au shop d'ajouter un market
const addShopMarkets = async (values: AddShopMarketsData) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

type UpdateShopMarketsData = {
  shopId: string | undefined;
  markets: string[];
};

const updateShopMarkets = async (values: UpdateShopMarketsData) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getShopInfos = async (token: string, id: string): Promise<ShopData> => {
  try {
    console.log(`${API_ROOT}/shops/myshop/${id}`);
    const response = await fetch(`${API_ROOT}/shops/myshop/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    const data = await response.json();
    console.log("getShopInfos: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getMarkets = async (city: string, radius: number[]) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify({ city, radius }),
    });
    const data = await response.json();
    console.log("getMarkets :", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  createOrUpdateShop,
  getShopInfos,
  updateClickCollect,
  getMarkets,
  addShopMarkets,
  updateShopMarkets,
};
