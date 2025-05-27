import axios from "axios";
import { Request, Response } from "express";
import { handleModelSearch } from "../utils/openrouter";

/**
 * GET /api/openoruter/credits
 * Get the current credits and usage for the API key
 * @returns The current credits and usage for the API key
 */
export const getCurrentCredits = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/credits", {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching credits:", err);
    res.status(500).json({
      error: "Failed to fetch credits",
      success: false,
    });
  }
};

/**
 * GET /api/openrouter/models
 * Get a list of models available for use based on the search parameters
 * @param name - The name of the model to search for
 * @param maxPrice - The maximum price of the model
 * @param minContextLength - The minimum context length of the model
 * @returns A list of models available for use
 * @throws Error if there is an error during the process
 */
export const modelSearch = async (req: Request, res: Response) => {
  try {
    const { name, maxPrice, minContextLength } = req.query;

    const models = await handleModelSearch({
      name: name as string,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minContextLength: minContextLength ? Number(minContextLength) : undefined,
    });

    res.json({
      data: models,
      success: true,
    });
  } catch (err) {
    console.error("Error fetching models:", err);
    res.status(500).json({
      error: "Failed to fetch models",
      success: false,
    });
  }
};
