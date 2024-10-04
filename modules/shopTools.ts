import { ShopData } from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const createOrUpdateShop = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/`, {
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

const updateClickCollect = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/clickCollect`, {
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

const getShopInfos = async (token: string, id: string): Promise<ShopData> => {
  try {
    console.log(`${API_ROOT}/shops/myshop/${id}`);
    const response = await fetch(`${API_ROOT}/shops/myshop/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });
    const data = await response.json();
    console.log("getShopInfos: ", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  createOrUpdateShop,
  getShopInfos,
  updateClickCollect,
};
