import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../middleware/authenticateToken";
import { extractAndHighlightCode } from "../utils/highlighter";
import prisma from "../config/prisma.config";
import {
  createConversationWithMessage,
  createTitle,
  Message,
  sendMessage,
} from "../services/chat.service";
import { findUser } from "../services/user.service";

export interface ChatRequest {
  model: string;
  context: Message[];
}

/**
 * POST /api/chat/message
 * @param message: Message - The message to send to the chat API.
 * @param model: string - The model to use for the chat completion
 * @param context: Message[] - The context for the chat completion
 * @return response.data.choices[0].message.content - The response message
 * content from the API.
 */
export const createMessage = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { context, model, conversationId } = req.body;
  const message = context[context.length - 1];
  const { content, role } = message;

  const { id } = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as Partial<User>;

  try {
    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const rawContent = await sendMessage({ model, context });
    const highlightedContent = extractAndHighlightCode(rawContent);

    await prisma.message.create({
      data: {
        content: highlightedContent,
        userId: id,
        conversationId,
        role,
      },
    });

    res.send({
      success: true,
      data: highlightedContent,
    });
  } catch (err) {
    console.error("Error sending chat message:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { context, model } = req.body;
  const message = context[context.length - 1];
  const { content } = message;

  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const title = await createTitle(model, content, id);
    const conversation = await createConversationWithMessage(
      title,
      content,
      id
    );

    res.json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create conversation",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const conversationId = parseInt(req.params.id);

  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        userId: id,
      },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const messageId = parseInt(req.params.id);

  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    // Delete the message
    await prisma.message.delete({
      where: {
        id: messageId,
        userId: id, // Ensure user owns the message
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "P2025"
    ) {
      res.status(404).json({
        success: false,
        error: "Message not found",
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete message",
    });
  }
};

/**
 * GET /api/chat/conversations
 * @returns conversations - The conversations for the user.
 */
export const getConversations = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: id,
      },
      include: {
        messages: true,
      },
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversations",
    });
  }
};

/**
 * DELETE /api/chat/conversations/:id
 * @param id - The ID of the conversation to delete.
 */
export const deleteConversation = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const conversationId = parseInt(req.params.id);

  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    // Delete the conversation
    await prisma.conversation.delete({
      where: {
        id: conversationId,
        userId: id, // Ensure user owns the conversation
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "P2025"
    ) {
      res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete conversation",
    });
  }
};

export const createPrompt = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { prompt } = req.body;
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        ...prompt,
      },
    });

    res.json({
      success: true,
      data: newPrompt,
    });
  } catch (err) {
    console.error("Error saving prompt:", err);
    res.status(500).json({
      success: false,
      error: "Failed to save prompt",
    });
  }
};

export const getPrompts = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const prompts = await prisma.prompt.findMany({
      where: {
        userId: id,
      },
    });

    res.json({
      success: true,
      data: prompts,
    });
  } catch (err) {
    console.error("Error fetching prompts:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch prompts",
    });
  }
};

export const deletePrompt = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { promptId } = req.params;
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }
    await prisma.prompt.delete({
      where: {
        id: parseInt(promptId),
        userId: id,
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Error deleting prompt:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete prompt",
    });
  }
};

export const updatePrompt = async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const { prompt } = req.body;
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Partial<User>;

    if (!id) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const updatedPrompt = await prisma.prompt.update({
      where: {
        id: prompt.id,
        userId: id,
      },
      data: {
        ...prompt,
      },
    });

    res.json({
      success: true,
      data: updatedPrompt,
    });
  } catch (err) {
    console.error("Error updating prompt:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update prompt",
    });
  }
};
