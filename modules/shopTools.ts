import {
  ApiResponse,
  ShopData,
  MarketData,
  ClickCollectData,
  MarketsData,
  AddressData,
  CrewMember,
} from "../types/API";

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

const updateShop = async (
  token: string | null,
  values: {
    _id: string | undefined;
    name: string;
    siret: string;
    shortDesc: string;
    longDesc: string;
    logo: string;
    address: AddressData;
    photos: string[];
    video: string[];
    crew: CrewMember[];
  },
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/update`, {
      method: "POST",
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
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
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

const updateShopFeatures = async (token: string | null, features: string[]) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/updateFeatures`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ features }),
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
      ? { success: true, data: data.features }
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

const updateShopOffline = async (
  token: string | null,
  values: { isOpen: boolean | undefined; reopenDate: Date | undefined },
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/offline`, {
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
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
  }
};

const getStocksByshopAndCategory = async (
  shopId: string | undefined,
  categoryName: string,
) => {
  try {
    const response = await fetch(
      `${API_ROOT}/shops/${shopId}/stocks-by-category/${encodeURIComponent(categoryName)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer les stocks.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.stocks }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des stocks.",
    };
  }
};

// type Period = {
//   openingTime: string | null;
//   closingTime: string | null;
// };
// type OpeningHour = {
//   day: number;
//   periods: Period[];
// };
// type ClickCollectValues = {
//   instructions: string | undefined;
//   openingHours: OpeningHour[];
// } | null;

// const updateClickCollect = async (
//   token: string | null,
//   values: ClickCollectValues,
// ): Promise<ApiResponse<ShopData>> => {
//   try {
//     const response = await fetch(`${API_ROOT}/shops/clickCollect`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         mode: "cors",
//       },
//       body: JSON.stringify(values),
//     });

//     if (!response.ok) {
//       return {
//         success: false,
//         data: null,
//         message: `Erreur ${response.status}: Impossible de mettre à jour.`,
//       };
//     }

//     const data = await response.json();

//     return data.success
//       ? { success: true, data: data.shop }
//       : { success: false, data: null, message: data.message };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       data: null,
//       message: "Une erreur s'est produite lors de la mise à jour.",
//     };
//   }
// };

const updateClickCollect = async (
  token: string | null,
  values: ClickCollectData,
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
  marketIds: string[];
};

// permet au shop d'ajouter un market
const addShopMarkets = async (
  token: string | null,
  values: AddShopMarketsData,
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets/add`, {
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
        message: `Erreur ${response.status}: Impossible d'obtenir les données.`,
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

type UpdateShopMarketsData = {
  markets: string[];
};

const updateShopMarkets = async (
  token: string | null,
  values: MarketsData[],
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets/update`, {
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
      message:
        "Une erreur s'est produite lors de la récupération du producteur.",
    };
  }
};

const getShopInfos = async (
  token: string | null,
  withStocks: string = "false",
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(
      `${API_ROOT}/shops/myshop?withStocks=${withStocks}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer le shop.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.shopInfos }
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

const getMarkets = async (
  city: string,
  radius: number[],
): Promise<ApiResponse<MarketData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/markets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify({ city, radius }),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible d'obtenir les données.`,
      };
    }

    const data = await response.json();

    console.log("getMarkets :", data);
    return data.success
      ? { success: true, data: data.markets }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
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
    // return
  }
};

export default {
  updateShop,
  createOrUpdateShop,
  updateShopOffline,
  updateShopTypes,
  updateShopFeatures,
  getShopInfos,
  getStocksByshopAndCategory,
  updateClickCollect,
  getMarkets,
  addShopMarkets,
  updateShopMarkets,
  getMarketById,
};
