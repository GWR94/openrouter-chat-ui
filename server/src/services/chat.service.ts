import prisma from "../config/prisma.config";
import axios from "axios";
import { ChatRequest } from "../controllers/chat.controller";

export const createConversationWithMessage = async (
  title: string,
  content: string,
  userId: number
) => {
  return await prisma.$transaction(async (tx) => {
    // Create the conversation first
    const conversation = await tx.conversation.create({
      data: {
        title,
        userId,
      },
    });

    // Create the message with the new conversationId
    await tx.message.create({
      data: {
        content,
        userId,
        conversationId: conversation.id,
        role: "user",
      },
    });

    // Return the created conversation and message
    return tx.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: true,
      },
    });
  });
};

export interface Message {
  id: number;
  role: string;
  content: string;
  userId?: number;
}

export const sendMessage = async ({ model, context }: ChatRequest) => {
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
};

export const createTitle = async (
  model: string,
  content: string,
  userId?: number
): Promise<string> => {
  const systemMessage: Message = {
    id: Date.now(),
    role: "system",
    content:
      "Generate a short, concise title (5-10 words) for this conversation based on the following message. Respond with only the title, no additional text or punctuation.",
  };

  const userMessage: Message = {
    id: Date.now() + 1,
    role: "user",
    content,
    userId,
  };

  const context = [systemMessage, userMessage];
  try {
    const response = await sendMessage({ model, context });
    return response.trim();
  } catch (err) {
    console.error("Error generating title", err);
    return content;
  }
};
