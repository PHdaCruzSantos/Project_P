const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const calculateShipping = async (shippingData) => {
  const response = await fetch(`${apiUrl}/api/shipping/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shippingData),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to calculate shipping");
  return await response.json();
};

export default {
  calculateShipping,
};
