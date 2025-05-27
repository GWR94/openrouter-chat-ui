import axios from "../config/axios.config";

export const handleCheckCredits = async () => {
  try {
    const response = await axios.get(`/openrouter/credits`);
    return response.data;
  } catch (error) {
    console.error("Error checking credits:", error);
    throw error;
  }
};

export const handleModelSearch = async (
  name?: string,
  maxPrice?: number,
  minContextLength?: number
) => {
  try {
    const params = new URLSearchParams();

    if (name) params.append("name", name);
    if (maxPrice) params.append("maxPrice", maxPrice.toString());
    if (minContextLength)
      params.append("minContextLength", minContextLength.toString());

    const queryString = params.toString();
    const url = `/openrouter/models${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};
