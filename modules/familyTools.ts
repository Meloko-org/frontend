import { ApiResponse, ProductFamilyData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getFamiliesByCategory = async (
  categoryName: string,
): Promise<ApiResponse<ProductFamilyData[]>> => {
  try {
    const response = await fetch(
      `${API_ROOT}/families/category/${categoryName}`,
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
        message: `Erreur ${response.status}: Impossible d'obtenir les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.families }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

export default {
  getFamiliesByCategory,
};
