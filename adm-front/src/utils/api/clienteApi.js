const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getClient = async (id) => {
  const response = await fetch(`${apiUrl}/api/client/${id}`, {
    method: "GET",
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    throw new Error("Failed to get client");
  }

  return await response.json();
};

export default { getClient };
