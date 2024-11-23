const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getItems = async () => {
  const response = await fetch(`${apiUrl}/api/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return await response.json();
};

const getItemById = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-search/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item by ID");
  }
  return await response.json();
};

const getItemsInStore = async (storeId) => {
  const response = await fetch(`${apiUrl}/api/item-store/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch items in store");
  }
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

const getItemHistoricSales = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-sales/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item sales");
  }
  return await response.json();
};

const getItemPromotions = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-promotions/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item promotions");
  }
  return await response.json();
};

const getItemReviews = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-reviews/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item reviews");
  }
  return await response.json();
};

const getItemsByCategory = async (category) => {
  const response = await fetch(`${apiUrl}/api/item-category/${category}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch items by category");
  }
  return await response.json();
};

const getItemAverageRating = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-rating/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item average rating");
  }
  return await response.json();
};

const addItem = async (storeId, item) => {
  const response = await fetch(`${apiUrl}/api/item/create/${storeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add item");
  }

  return await response.json();
};

const updateItem = async (itemId, item) => {
  const response = await fetch(`${apiUrl}/api/item/update/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update item");
  }

  return await response.json();
};

const deleteItem = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item/delete/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete item");
  }

  return await response.json();
};
const getAllVariantsItem = async (itemId) => {
  const response = await fetch(`${apiUrl}/api/item-variant-all/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch item variants");
  }
  return await response.json();
};

const getVariantItemById = async (variantId) => {
  const response = await fetch(`${apiUrl}/api/item-variant/${variantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch variant item by ID");
  }
  return await response.json();
};

const addVariantItem = async (itemId, variant) => {
  const response = await fetch(`${apiUrl}/api/item-variant/create/${itemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(variant),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add variant item");
  }

  return await response.json();
};

const updateVariantItem = async (variantId, variant) => {
  const response = await fetch(
    `${apiUrl}/api/item-variant/update/${variantId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variant),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update variant item");
  }

  return await response.json();
};

const addCoupons = async (coupon) => {
  const response = await fetch(`${apiUrl}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add coupon");
  }

  return await response.json();
};

const addItemPromotion = async (itemId, promotion) => {
  const response = await fetch(`${apiUrl}/api/item-promotion/${itemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promotion),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add item promotion");
  }

  return await response.json();
};

const addCategory = async (category) => {
  const response = await fetch(`${apiUrl}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add category");
  }

  return await response.json();
};

const addItemCategory = async (itemId, category) => {
  const response = await fetch(`${apiUrl}/api/item-category/${itemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add item category");
  }

  return await response.json();
};

const addReview = async (itemId, clientId, review) => {
  const response = await fetch(
    `${apiUrl}/api/item/review/${itemId}/${clientId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return await response.json();
};

const addSale = async (clientId, itemId, sale) => {
  const response = await fetch(
    `${apiUrl}/api/item/sale/${clientId}/${itemId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add sale");
  }

  return await response.json();
};

const getAllCategories = async () => {
  const response = await fetch(`${apiUrl}/api/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return await response.json();
};

export default {
  getItems,
  getItemById,
  getItemsInStore,
  getAllInfoItem,
  getItemHistoricSales,
  getItemPromotions,
  getItemReviews,
  getItemsByCategory,
  getItemAverageRating,
  addItem,
  updateItem,
  deleteItem,
  addVariantItem,
  updateVariantItem,
  addCoupons,
  addItemPromotion,
  addCategory,
  addItemCategory,
  addReview,
  addSale,
  getAllVariantsItem,
  getVariantItemById,
  getAllCategories,
};
