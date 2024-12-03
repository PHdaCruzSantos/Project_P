const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getClient = async (id) => {
  const response = await fetch(`${apiUrl}/api/client/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to get client");
  return await response.json();
};

const updateClient = async (id, data) => {
  const response = await fetch(`${apiUrl}/api/client/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update client");
  return await response.json();
};
const toggleFavorite = async (clientId, itemId) => {
  const favorites = await getFavorites(clientId);
  const isFavorite = favorites.includes(itemId);
  const response = await fetch(
    `${apiUrl}/api/client/${clientId}/favorite/${itemId}`,
    {
      method: isFavorite ? "DELETE" : "POST",
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Failed to toggle favorite");
  return await response.json();
};

const getFavorites = async (clientId) => {
  const response = await fetch(`${apiUrl}/api/client/${clientId}/favorites`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to get favorites");
  return await response.json();
};
const getClientAddresses = async (clientId) => {
  const response = await fetch(`${apiUrl}/api/client/${clientId}/addresses`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to get addresses");
  return await response.json();
};

export default {
  getClient,
  updateClient,
  toggleFavorite,
  getFavorites,
  getClientAddresses,
};
