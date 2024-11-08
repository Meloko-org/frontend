const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getAvailableProductsForAShop = async (token: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/available-products`, {
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
    return error;
  }
};

const addProductsToAShop = async (token: string, values: string) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/add-products`, {
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
    return error;
  }
};

export default {
  getAvailableProductsForAShop,
  addProductsToAShop,
};
