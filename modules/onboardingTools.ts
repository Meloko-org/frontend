import { ProducerState } from "../reducers/producer";
import { ApiResponse, ProducerData, ShopData, UserData } from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const onboarding1 = async (
  token: string | null,
  values: {
    name: string;
    lastname: string;
    socialReason: string;
    siren: string;
    iban: string;
    bic: string;
    kbis: string | null;
  },
): Promise<ApiResponse<{ user: UserData; producer: ProducerData }>> => {
  try {
    const response = await fetch(`${API_ROOT}/onboarding/1`, {
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
        message: `Erreur ${response.status}: Impossible de mettre à jour. `,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.data }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
  }
};

const onboarding2 = async (
  token: string | null,
  values: {
    shopName: string;
    shortDesc: string;
    logo: string | null;
    photo: string | null;
  },
): Promise<ApiResponse<{ producer: ProducerData; shop: ShopData }>> => {
  try {
    const response = await fetch(`${API_ROOT}/onboarding/2`, {
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
        message: `Erreur ${response.status}: Impossible de mettre à jour.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.data }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
  }
};

const onboarding3 = async (
  token: string | null,
  types: string[],
): Promise<ApiResponse<{ producer: ProducerData; shop: ShopData }>> => {
  try {
    const response = await fetch(`${API_ROOT}/onboarding/3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ types }),
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
      ? { success: true, data: data.data }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
  }
};

const onboarding4 = async (
  token: string | null,
  isPremium: boolean,
): Promise<ApiResponse<{ producer: ProducerData; shop: ShopData }>> => {
  try {
    const response = await fetch(`${API_ROOT}/onboarding/4`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ isPremium }),
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
      ? { success: true, data: data.data }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour.",
    };
  }
};

export default {
  onboarding1,
  onboarding2,
  onboarding3,
  onboarding4,
};
