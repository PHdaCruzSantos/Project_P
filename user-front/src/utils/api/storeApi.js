const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getStore = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/store/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch store");
  }
  return await response.json();
};

export default {
  getStore,
};
