import { StockData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getStocksByShop = async (id: string) => {
  try {
    const response = await fetch(`${API_ROOT}/stocks/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateStocks = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/stocks/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
  getStocksByShop,
  updateStocks,
};
