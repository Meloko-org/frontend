import { ApiResponse, ProductData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getProductsForFamily = async (
  familyName: string,
): Promise<ApiResponse<ProductData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/products/family/${familyName}`, {
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
        message: `Erreur ${response.status}: Impossible d'obtenir les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.products }
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

const getProductsForCategory = async (
  categoryName: string,
): Promise<ApiResponse<ProductData[]>> => {
  try {
    const response = await fetch(
      `${API_ROOT}/products/category/${categoryName}`,
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
      ? { success: true, data: data.products }
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

const getAvailableProductsForAShop = async (
  token: string,
  searchTerm: string,
) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/available-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ searchTerm }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const addProductsToAShop = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/add-products`, {
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
    return error;
  }
};

const getProductById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_ROOT}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default {
  getProductsForFamily,
  getProductsForCategory,
  getAvailableProductsForAShop,
  addProductsToAShop,
  getProductById,
};
