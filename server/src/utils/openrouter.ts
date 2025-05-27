import axios from "axios";
import { Message } from "../services/chat.service";

export interface ChatRequest {
  model: string;
  context: Message[];
}

/**
 * Generates a chat response based on the provided model and context.
 * @param model - The model to use for generating the response.
 * @param context - The context of the conversation.
 * @returns The generated chat response.
 * @throws Error if there is an error during the process.
 */
export const getChatResponse = async ({ model, context }: ChatRequest) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model, messages: context },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
};

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: number;
    completion: number;
  };
  context_length: number;
  architecture?: string;
}

interface ModelsResponse {
  data: ModelInfo[];
}

export const handleModelSearch = async (searchParams?: {
  name?: string;
  maxPrice?: number;
  minContextLength?: number;
}) => {
  try {
    const response = await axios.get<ModelsResponse>(
      "https://openrouter.ai/api/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let filteredModels = response.data.data;

    if (searchParams) {
      filteredModels = filteredModels.filter((model) => {
        const nameMatch =
          !searchParams.name ||
          model.name.toLowerCase().includes(searchParams.name.toLowerCase());
        const priceMatch =
          !searchParams.maxPrice ||
          model.pricing.completion <= searchParams.maxPrice;
        const contextMatch =
          !searchParams.minContextLength ||
          model.context_length >= searchParams.minContextLength;

        return nameMatch && priceMatch && contextMatch;
      });
    }

    return filteredModels;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};
