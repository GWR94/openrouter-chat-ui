import { Request, Response } from "express";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function sendChatMessage(req: Request, res: Response) {
  const { model, message } = req.body;
  try {
    const res = fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });
    console.log(res);
    return res;

    // Log the full response data
    // console.log("Response data:", JSON.stringify(response.data, null, 2)); // Pretty printing
  } catch (error) {
    console.error("Error communicating with OpenRouter:", error);
  }
}
