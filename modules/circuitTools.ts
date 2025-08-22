import {
  ApiResponse,
  CircuitOptionsData,
  CircuitParamsData,
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

export default {
  getCircuit,
};
