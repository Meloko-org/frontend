import { ApiResponse, ShopData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const activeWithdrawModes = async (
  token: string | null,
  values: {
    mode: "clickCollect" | "markets";
    value: boolean;
  },
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/withdraws/activation`, {
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
      ? { success: true, data: data.shop, message: data.message }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

export default {
  activeWithdrawModes,
};
