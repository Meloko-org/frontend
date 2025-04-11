const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getAvailableProductsForAShop = async (
  token: string,
  searchTerm: string,
) => {
  try {
    const response = await fetch(`${API_ROOT}/shops/available-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify({ searchTerm }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const addProductsToAShop = async (token: string, values: string[]) => {
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

const getProductById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_ROOT}/products/${id}`, {
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

export default {
  getAvailableProductsForAShop,
  addProductsToAShop,
  getProductById,
};
