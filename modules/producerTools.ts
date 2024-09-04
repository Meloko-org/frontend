import { ProducerData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getProducerInfos = async (token: string): Promise<ProducerData> => {
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

const updateProducer = async (token: string, values: string) => {
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

export default {
  updateProducer,
  getProducerInfos,
};
