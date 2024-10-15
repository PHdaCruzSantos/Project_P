const API_URL = "http://localhost:3000";

const getItems = async () => {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return await response.json();
};

const setItem = async (item) => {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to set item");
  }
};

const deleteItem = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

export default { getItems, setItem, deleteItem };
