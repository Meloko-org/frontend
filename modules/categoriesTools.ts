import { ApiResponse, ProductCategoryData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

// à supprimer
const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_ROOT}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getGlobalCategories = async (): Promise<
  ApiResponse<ProductCategoryData>
> => {
  try {
    const response = await fetch(`${API_ROOT}/categories`, {
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
        message: `Erreur ${response.status}: Impossible de récupérer les catégories.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.categories }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message:
        "Une erreur s'est produite lors de la récupération des catégories.",
    };
  }
};

export default {
  getAllCategories,
  getGlobalCategories,
};
