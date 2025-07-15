import {
  ApiResponse,
  ShopData,
  MarketData,
  SocialPostSettingsData,
} from "../types/API";
import { SocialNetworkState } from "../types/States";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const updateNetworks = async (
  token: string | null,
  values: { network: string; updates: Partial<SocialNetworkState> },
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/socials/networks`, {
      method: "PATCH",
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
      ? { success: true, data: data.shop }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

const updateSocialPostSettings = async (
  token: string | null,
  values: {
    frequency?: {
      mode: "manual" | "reminder";
      timesPerWeek: number;
      preferredDays?: string[]; // ex: ["monday", "friday"]
    };
    customHashtags?: string[];
    customMentions?: string[];
  },
): Promise<ApiResponse<ShopData>> => {
  try {
    const response = await fetch(`${API_ROOT}/shops/socialPostSettings`, {
      method: "PATCH",
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
      ? { success: true, data: data.shop }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

const getAvailableHashtags = async (token: string | null) => {
  try {
    const response = await fetch(
      `${API_ROOT}/shops/socialPostSettings/hashtags`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          mode: "cors",
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de mettre à jour.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.tags }
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
  updateNetworks,
  updateSocialPostSettings,
  getAvailableHashtags,
};
