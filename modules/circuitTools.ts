import {
  ApiResponse,
  CircuitOptionsData,
  CircuitParamsData,
  NoteData,
  ShopData,
} from "../types/API";
const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getCircuit = async (
  params: CircuitOptionsData,
): Promise<ApiResponse<CircuitParamsData>> => {
  try {
    const response = await fetch(`${API_ROOT}/circuits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de créer le circuit.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.results }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la création du circuit.",
    };
  }
};

const updateCircuit = async (
  updatedShops: ShopData[],
  userPosition: {
    latitude: number | undefined;
    longitude: number | undefined;
  },
): Promise<ApiResponse<CircuitParamsData>> => {
  try {
    const response = await fetch(`${API_ROOT}/circuits/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify({ updatedShops, userPosition }),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: impossible de mettre à jour le circuit`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.results }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la mise à jour du circuit.",
    };
  }
};

const addNoteFromCircuit = async (params: {
  rating: number | null | undefined;
  userId: string | undefined;
  shopId: string | undefined;
  source: string;
  comment: string | undefined;
  photo: string | null | undefined;
}): Promise<ApiResponse<NoteData>> => {
  try {
    const response = await fetch(`${API_ROOT}/circuits/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible d'ajouter la note.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.note }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de l'ajout de la note.",
    };
  }
};

export default {
  getCircuit,
  updateCircuit,
  addNoteFromCircuit,
};
