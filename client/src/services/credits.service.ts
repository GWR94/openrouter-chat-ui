import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getCredits = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/chat/credits`);
    return response.data;
  } catch (error) {
    console.error("Error checking credits:", error);
    throw error;
  }
};
