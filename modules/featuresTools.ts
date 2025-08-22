import { ApiResponse, ShopFeaturesData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getShopFeatures = async (): Promise<ApiResponse<ShopFeaturesData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/shopfeatures`, {
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
        message: `Error ${response.status}: Impossible de récupérer les features`,
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
      message:
        "Une erreur s'est produite lors de la récupération des features.",
    };
  }
};

export default {
  getShopFeatures,
};
