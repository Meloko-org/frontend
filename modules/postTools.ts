import {
  ActivityPostData,
  ApiResponse,
  GeneratedPostData,
  NoteData,
  ValidatePostData,
  ValidatePostValues,
} from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const generatePost = async (
  token: string | null,
  values: {
    subjectType: string;
    elementId: string;
    selectedThemeId: string | undefined;
    productTags: string[];
    networks: string[];
  },
): Promise<ApiResponse<GeneratedPostData>> => {
  try {
    console.log("POSTTOOLS: ", values);
    const response = await fetch(`${API_ROOT}/posts/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de générer le post.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.post }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la génération du post.",
    };
  }
};

const validatePost = async (
  token: string | null,
  values: ValidatePostValues,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_ROOT}/posts/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur ${response.status}: Impossible de générer le post.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, message: data.message }
      : { success: false, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la génération du post.",
    };
  }
};

const getProgrammedPosts = async (
  token: string | null,
): Promise<ApiResponse<ValidatePostData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/posts/programmed`, {
      method: "GET",
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
        message: `Erreur ${response.status}: Impossible d'obtenir les posts programmés.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.posts }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des posts.",
    };
  }
};

const postProgrammedPosts = async (
  token: string | null,
  post: ValidatePostData,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_ROOT}/posts/postProgrammedPosts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur ${response.status}: Impossible de poster le post.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, message: data.message }
      : { success: false, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la publication du post.",
    };
  }
};

const getPostHistory = async (
  token: string | null,
): Promise<ApiResponse<ValidatePostData[]>> => {
  try {
    const response = await fetch(`${API_ROOT}/posts/History`, {
      method: "GET",
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
        message: `Erreur ${response.status}: Impossible de récupérer l'historique des posts.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.posts }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la publication du post.",
    };
  }
};

export default {
  generatePost,
  validatePost,
  getProgrammedPosts,
  postProgrammedPosts,
  getPostHistory,
};
