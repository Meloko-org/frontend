import { ApiResponse, StockData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getStocksByShop = async (
  id: string,
): Promise<ApiResponse<StockData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/stocks/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
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
      ? { success: true, data: data.stocks }
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

const updateStocks = async (
  token: string | null,
  values: StockData,
): Promise<ApiResponse<StockData>> => {
  try {
    const response = await fetch(`${API_ROOT}/stocks/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
      ? { success: true, data: data.stock }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour des données.",
    };
  }
};

export default {
  getStocksByShop,
  updateStocks,
};
