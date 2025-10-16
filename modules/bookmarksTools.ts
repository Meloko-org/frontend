import { ApiResponse, UserData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const updateBookmarks = async (
  token: string | null,
  shopId: string | undefined,
): Promise<ApiResponse<UserData>> => {
  try {
    const response = await fetch(`${API_ROOT}/users/bookmarks/${shopId}`, {
      method: "POST",
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
        message: `Erreur ${response.status}: Impossible d'ajouter ce favori.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.user, message: data.message }
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
  updateBookmarks,
};
