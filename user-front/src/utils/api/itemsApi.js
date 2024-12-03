const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getAllItems = async () => {
  const response = await fetch(`${apiUrl}/api/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch items");
  return await response.json();
};

const getItemsByCategory = async (category) => {
  const response = await fetch(`${apiUrl}/api/item-category/${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch items by category");
  return await response.json();
};

const getItemInfo = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-info/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch item info");
  return await response.json();
};

const getItemReviews = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-reviews/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch item reviews");
  return await response.json();
};
const getAllInfoItem = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-info/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item info");
  }
  return await response.json();
};

export default {
  getAllItems,
  getItemsByCategory,
  getItemInfo,
  getItemReviews,
  getAllInfoItem,
};
