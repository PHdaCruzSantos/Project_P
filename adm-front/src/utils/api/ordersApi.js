const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getOrderById = async (orderId) => {
  const response = await fetch(`${apiUrl}/orders/${orderId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return await response.json();
};

const getStoreOrders = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/store/${storeId}/orders`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch store orders");
  }

  const data = await response.json();
  console.log(data);
  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
};

const getStoreMetrics = async (storeId) => {
  const response = await fetch(`${apiUrl}/orders/store/${storeId}/metrics`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch store metrics");
  }

  return await response.json();
};

const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  return await response.json();
};

const getClientOrders = async (clientId) => {
  const response = await fetch(`${apiUrl}/orders/order/${clientId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch client orders");
  }

  return await response.json();
};

export default {
  getOrderById,
  getStoreOrders,
  getStoreMetrics,
  updateOrderStatus,
  getClientOrders,
};
