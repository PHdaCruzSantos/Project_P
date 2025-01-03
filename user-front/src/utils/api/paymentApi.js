const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const createPayment = async (paymentData) => {
  const response = await fetch(`${apiUrl}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId: paymentData.clientId,
      value: paymentData.value,
      items: paymentData.items,
      description: `Order from client ${paymentData.clientId}`,
      externalReference: `order_${Date.now()}`,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create payment");
  }

  return await response.json();
};

const getPaymentStatus = async (paymentId) => {
  const response = await fetch(`${apiUrl}/payment/status/${paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to check payment status");
  }

  const data = await response.json();
  return data.status;
};

export default {
  createPayment,
  getPaymentStatus,
};
