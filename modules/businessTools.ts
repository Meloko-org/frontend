import {
  ApiResponse,
  OrderData,
  OrderSummary,
  ProductDetail,
  StockData,
} from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getOrderSummary = async (
  token: string | null,
): Promise<ApiResponse<OrderSummary[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/business/summary`, {
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
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.orders }
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

/* récupère les orders d'un producer */
const getOrders = async (
  token: string | null,
  type: "pending" | "validated" | "withdrawn" | "canceled" | "all",
  page = 1,
  limit = 10,
) => {
  try {
    const response = await fetch(
      `${API_ROOT}/business/orders?type=${type}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? {
          success: true,
          orders: data.orders,
          total: data.total,
          page: data.page,
          totalPages: data.totalPages,
        }
      : { success: false, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

export default {
  getOrderSummary,
  getOrders,
};
