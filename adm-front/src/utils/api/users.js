const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const getUsers = async () => {
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent and received
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return await response.json();
};

const getUserById = async (id) => {
  const response = await fetch(`${apiUrl}/api/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent and received
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user by ID");
  }
  return await response.json();
};

const createUser = async (user) => {
  const response = await fetch(`${apiUrl}/api/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return await response.json();
};

const updateUser = async (id, user) => {
  const response = await fetch(`${apiUrl}/api/user/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(`${apiUrl}/api/user/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return await response.json();
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
