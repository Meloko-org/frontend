const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getOrderDetailsById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_ROOT}/orders/${id}`, {
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
  getOrderDetailsById,
};
