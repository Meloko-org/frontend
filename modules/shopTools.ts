const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const createNewShop = async (token: string, values: string) => {
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

const getShopInfos = async (token: string, id: string) => {
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

    return data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  createNewShop,
  getShopInfos,
};
