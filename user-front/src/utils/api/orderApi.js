const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const createOrder = async (orderData) => {
  const response = await fetch(`${apiUrl}/api/order-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return await response.json();
};

const getOrderById = async (orderId) => {
  const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch order");
  }

  return await response.json();
};

const getClientOrders = async (clientId) => {
  console.log("orderId", clientId);
  const response = await fetch(`${apiUrl}/api/order/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return await response.json();
};

const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update order status");
  }

  return await response.json();
};

export default {
  createOrder,
  getOrderById,
  getClientOrders,
  updateOrderStatus,
};
