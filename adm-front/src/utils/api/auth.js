const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

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
    throw new Error("Failed to login user");
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
    throw new Error("Failed to login client");
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
