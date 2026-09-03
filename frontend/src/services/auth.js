import api from "./api";

// ===============================
// LOGIN
// ===============================
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  const { access_token, user } = response.data;

  // Save JWT token
  localStorage.setItem(
    "access_token",
    access_token
  );

  // Save logged-in user
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  return response.data;
};


// ===============================
// REGISTER
// ===============================
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// ===============================
// LOGOUT
// ===============================
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};


// ===============================
// GET SAVED USER
// ===============================
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error(
      "Failed to parse stored user:",
      error
    );

    localStorage.removeItem("user");

    return null;
  }
};


// ===============================
// CHECK AUTHENTICATION
// ===============================
export const isAuthenticated = () => {
  const token = localStorage.getItem(
    "access_token"
  );

  return Boolean(token);
};


// ===============================
// GET TOKEN
// ===============================
export const getAccessToken = () => {
  return localStorage.getItem(
    "access_token"
  );
};