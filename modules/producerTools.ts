import { ProducerData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getProducerInfos = async (
  token: string | null,
): Promise<ProducerData> => {
  try {
    const response = await fetch(`${API_ROOT}/producers/logged`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    const data = await response.json();
    // console.log("getProducerInfos: ", data)
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateProducer = async (token: string | null, values: {}) => {
  try {
    const response = await fetch(`${API_ROOT}/producers/update`, {
      method: "PUT",
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
  }
};

const initialiseProducer = async (token: string | null) => {
  try {
    const response = await fetch(`${API_ROOT}/producers/initialise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Erreur serveur: veuillez réessayer plus tard.",
    };
  }
};

const createProducer = async (token: string | null, values: {}) => {
  try {
    const response = await fetch(`${API_ROOT}/producers/create`, {
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
  }
};

const getAllOrders = async (token: string) => {
  try {
    const response = await fetch(`${API_ROOT}/business/all`, {
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
  }
};

const getLastThreeOrders = async (token: string) => {
  try {
    const response = await fetch(`${API_ROOT}/business/lastthree`, {
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
  }
};

export default {
  createProducer,
  updateProducer,
  getProducerInfos,
  getAllOrders,
  getLastThreeOrders,
  initialiseProducer,
};
