import { ApiResponse, ShopData, MarketData } from "../types/API";

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

const updateShopTypes = async (token: string | null, types: string[]) => {
  console.log("les types :", types);
  try {
    const response = await fetch(`${API_ROOT}/shops/updateTypes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ types }),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de mettre à jour.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.types }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
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
): Promise<ApiResponse<ShopData>> => {
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

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de mettre à jour.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.shop }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
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

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de mettre à jour.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.markets }
      : { succes: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message:
        "Une erreur s'est produite lors de la récupération du producteur.",
    };
  }
};

const getShopInfos = async (
  token: string | null,
  id: string,
): Promise<ApiResponse<ShopData>> => {
  try {
    //console.log(`${API_ROOT}/shops/myshop/${id}`);
    const response = await fetch(`${API_ROOT}/shops/myshop/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer le shop.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.shop }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message:
        "Une erreur s'est produite lors de la récupération du producteur.",
    };
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

const getMarketById = async (marketId: string): Promise<MarketData> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets/${marketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    // return null
  }
};

export default {
  createOrUpdateShop,
  updateShopTypes,
  getShopInfos,
  updateClickCollect,
  getMarkets,
  addShopMarkets,
  updateShopMarkets,
  getMarketById,
};
