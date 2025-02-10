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
const loginUser = async (user) => {
  const response = await fetch(`${apiUrl}/auth/login-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return await response.json();
};

const loginClient = async (client) => {
  const response = await fetch(`${apiUrl}/auth/login-client`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
    credentials: "include", // Ensures cookies are sent and received
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return await response.json();
};

const logout = async () => {
  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout user");
  }

  return await response.json();
};

export default {
  loginUser,
  loginClient,
  logout,
};
