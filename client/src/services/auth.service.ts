import axios from "../config/axios.config";

interface Credentials {
  username: string;
  password: string;
}

export const login = async ({ username, password }: Credentials) => {
  try {
    const response = await axios.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post(`/auth/logout`);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const register = async ({ username, password }: Credentials) => {
  try {
    const response = await axios.post(`/auth/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`/auth/verify`);
    console.log(response.data);
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
};

export const loginOAuthUser = async (provider: string) => {
  window.location.href = `${
    import.meta.env.VITE_API_URL
  }/auth/login/${provider}`;
};
