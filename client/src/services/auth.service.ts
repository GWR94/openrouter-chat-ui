import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface Credentials {
  username: string;
  password: string;
}

export const login = async ({ username, password }: Credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, {
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
    await axios.post(`${apiUrl}/api/auth/logout`);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const register = async ({ username, password }: Credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};
