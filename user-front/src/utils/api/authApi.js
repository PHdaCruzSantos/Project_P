const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const handleApiError = async (response) => {
  const data = await response.json();

  // Handle different types of error responses
  if (response.status === 401) {
    throw new Error("Invalid credentials");
  } else if (response.status === 404) {
    throw new Error("User not found");
  } else if (response.status === 409) {
    throw new Error("Email already exists");
  }

  throw new Error(data.message || "An error occurred");
};

const login = async (credentials) => {
  const response = await fetch(`${apiUrl}/auth//login-client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    await handleApiError(response);
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
    await handleApiError(response);
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
