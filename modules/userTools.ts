import { ApiResponse, UserData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getUserInfos = async (
  token: string | null,
): Promise<ApiResponse<UserData>> => {
  try {
    const response = await fetch(`${API_ROOT}/users/logged`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer l'utilisateur.`,
      };
    }

    const data = await response.json();
    console.warn("user data", data.user.addresses);
    return data.success
      ? { success: true, data: data.user }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      message:
        "Une erreur s'est produite lors de la récupération de l'utilisateur.",
    };
  }
};

const updateUser = async (token: string | null, values: {}) => {
  try {
    const response = await fetch(`${API_ROOT}/users/logged`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
    });
    console.log(response);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const addUserAddress = async (token: string | null, values: {}) => {
  try {
    const response = await fetch(`${API_ROOT}/users/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.warn("new address", data);

    return data;
  } catch (error) {
    console.error(error);
  }
};

const removeUserAddress = async (token: string | null, id: string) => {
  try {
    const response = await fetch(`${API_ROOT}/users/addresses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getUserInfos,
  updateUser,
  addUserAddress,
  removeUserAddress,
};
