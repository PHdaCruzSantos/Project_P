const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const login = async (credentials) => {
  const response = await fetch(`${apiUrl}/auth//login-client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }

  return await response.json();
};

const register = async (userData) => {
  const response = await fetch(`${apiUrl}/api//client/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }

  return await response.json();
};

const logout = async () => {
  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return true;
};

const checkAuth = async () => {
  const response = await fetch(`${apiUrl}/auth/check`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return await response.json();
};

export default {
  login,
  register,
  logout,
  checkAuth,
};
