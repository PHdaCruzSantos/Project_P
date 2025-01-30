const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const createCoupon = async (storeId, couponData) => {
  const response = await fetch(`${apiUrl}/api/store/${storeId}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(couponData),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create coupon");
  }

  return await response.json();
};

const getAllCoupons = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/store/${storeId}/coupons`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch coupons");
  }

  return await response.json();
};

const getCouponById = async (couponId) => {
  const response = await fetch(`${apiUrl}/api/coupons/${couponId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch coupon");
  }

  return await response.json();
};

const updateCoupon = async (couponId, couponData) => {
  const response = await fetch(`${apiUrl}/api/coupons/${couponId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(couponData),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update coupon");
  }

  return await response.json();
};

const deleteCoupon = async (couponId) => {
  const response = await fetch(`${apiUrl}/api/coupons/${couponId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete coupon");
  }

  return await response.json();
};

export default {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
