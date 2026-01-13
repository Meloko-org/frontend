import { ApiResponse, OrderDataForShop } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const updateOrderProductPickedUp = async (
  token: string | null,
  orderId: string,
  values: {
    subOrderId: string;
    productId: string;
    pickedUp: boolean;
  },
): Promise<ApiResponse<OrderDataForShop>> => {
  try {
    const response = await fetch(
      `${API_ROOT}/sav/order/${orderId}/update-picked-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
        body: JSON.stringify(values),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.order }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Impossible de mettre à jour.",
    };
  }
};

const refundOrderProducts = async (
  token: string | null,
  orderId: string,
  values: {
    subOrderId: string;
    productIds: string[];
    reason: string;
    scope: string;
  },
) => {
  try {
    const response = await fetch(`${API_ROOT}/sav/order/${orderId}/refund`, {
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
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? {
          success: true,
          data: data.order,
          refundsPending: data.refundsPending,
        }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Impossible de mettre à jour.",
    };
  }
};

export default {
  updateOrderProductPickedUp,
  refundOrderProducts,
};
