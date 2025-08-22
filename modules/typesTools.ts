import { ApiResponse } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getTypes = async (token: string | null) => {
  try {
    const response = await fetch(`${API_ROOT}/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getTypeLabels = async (): Promise<
  ApiResponse<[{ _id: string; label: string }]>
> => {
  try {
    const response = await fetch(`${API_ROOT}/types/labels`, {
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
        message: `Erreur ${response.status}: Impossible de récupérer les labels.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.labels }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des labels.",
    };
  }
};

export default {
  getTypes,
  getTypeLabels,
};
