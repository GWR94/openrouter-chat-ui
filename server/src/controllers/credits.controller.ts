import axios from "axios";
import { Request, Response } from "express";

/**
 * GET /api/credits
 * Get the current credits and usage for the API key
 * @returns The current credits and usage for the API key
 */
export const getCurrentCredits = async (req: Request, res: Response) => {
  const response = await axios.get("https://openrouter.ai/api/v1/credits", {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  res.json(response.data);
};
