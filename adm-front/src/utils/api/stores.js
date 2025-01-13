const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getStores = async (userId) => {
  const response = await fetch(`${apiUrl}/api/stores-user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to fetch stores");
  }
  return await response.json();
};

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

const addStore = async (userId, store) => {
  const response = await fetch(`${apiUrl}/api/stores/create/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add store");
  }

  return await response.json();
};

const updateStore = async (storeId, store) => {
  const response = await fetch(`${apiUrl}/api/stores/update/${storeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update store");
  }

  return await response.json();
};

const desativeStore = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/stores/desative/${storeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to desative store");
  }

  return await response.json();
};

const deleteStore = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/stores/delete/${storeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete store");
  }

  return await response.json();
};

export default {
  getStores,
  addStore,
  updateStore,
  desativeStore,
  deleteStore,
  getStore,
};
