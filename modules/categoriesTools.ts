const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_ROOT}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  getAllCategories,
};
