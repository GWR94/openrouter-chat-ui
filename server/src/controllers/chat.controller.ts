import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import axios from "axios";
import { User } from "../middleware/authenticateToken";
import { extractAndHighlightCode } from "../utils/highlighter";
import prisma from "../config/prisma.config";
import { ApiResponse } from "../routes";
import {
  createConversationWithMessage,
  createTitle,
  Message,
  sendMessage,
} from "../services/chat.service";
import { findUser } from "../services/user.service";

export interface ChatRequest {
  model: string;
  content: string;
  userId?: number;
}

/**
 * POST /api/chat
 * @param model: string - The model to use for the chat completion
 * @param context: Message[] - The context for the chat completion
 * @return response.data.choices[0].message.content - The response message
 * content from the API.
 */
export const sendChatMessage = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  let { conversationId } = req.body;
  const { model, context } = req.body;

  // test - check if id throws if conversationId is null or undefined

  const { id } = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as Partial<User>;

  const user = await findUser({ id });

  await prisma.message.create({
    data: {
      content: context[context.length - 1].content,
      userId: user?.id,
      conversationId: conversationId,
      role: user ? "user" : "assistant",
    },
  });

  const content = await sendMessage({ model, context });
  const highlightedContent = extractAndHighlightCode(content);
  res.send({
    success: true,
    data: highlightedContent,
  });
};

/**
 * POST /api/chat/:id
 *
 */
export const createConversation = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { message } = req.body;

  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      return res.status(401).json({ error: "Unauthorized", success: false });
    }
    const title = await createTitle(message);

    const newConversation = createConversationWithMessage(
      title,
      message.content,
      id
    );
    res.status(201).json({
      success: true,
      data: newConversation,
    });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create conversation",
    });
  }
};
