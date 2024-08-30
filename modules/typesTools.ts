const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getTypes = async (token: string) => {
  try {
    const response = await fetch(`${API_ROOT}/types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  getTypes,
};
