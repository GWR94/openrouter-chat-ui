import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthenticatedRequest, User } from "../middleware/authenticateToken";
import { extractAndHighlightCode } from "../utils/highlighter";
import prisma from "../config/prisma.config";
import { createConversationWithMessage } from "../services/chat.service";
import { getChatResponse } from "../utils/openrouter";

/**
 * POST /api/chat/message
 * @param message: Message - The message to send to the chat API.
 * @param model: string - The model to use for the chat completion
 * @param context: Message[] - The context for the chat completion
 * @return message - The created message
 * @throws 500 - If the message could not be created.
 * @throws 401 - If the user is not authenticated.
 */
export const createMessage = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  const { context, model, conversationId } = req.body;
  const message = context[context.length - 1];
  const { role } = message;
  try {
    const rawContent = await getChatResponse({ model, context });
    const highlightedContent = extractAndHighlightCode(rawContent);

    const message = {
      userId: id,
      conversationId,
      role,
      content: highlightedContent,
    };

    const newMessage = await prisma.message.create({
      data: message,
    });

    res.send({
      success: true,
      data: {
        id: newMessage.id,
        ...message,
      },
    });
  } catch (err) {
    console.error("Error sending chat message:", err);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

/**
 * POST /api/chat/conversation
 * @param content: string - The content of the message to send to the chat API.
 * @param model: string - The model to use for the chat completion
 * @returns conversation - The created conversation with the first message
 * @throws 500 - If the conversation could not be created.
 * @throws 401 - If the user is not authenticated.
 */
export const createConversation = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  const { content, model } = req.body;

  try {
    const conversation = await createConversationWithMessage({
      content,
      userId: id,
      model,
    });

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

/**
 * GET /api/chat/messages/:id
 * @param id - The ID of the conversation to get messages for.
 * @returns messages - The messages for the conversation.
 * @throws 404 - If the conversation is not found.[EOS]
 * @throws 500 - If the messages could not be fetched.
 * @throws 401 - If the user is not authenticated.
 */
export const getMessages = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  const conversationId = parseInt(req.params.id);

  try {
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

/**
 * DELETE /api/chat/message/:id
 * @param id - The ID of the message to delete.
 * @returns success - Whether the message was deleted successfully.
 * @throws 404 - If the message is not found.
 * @throws 500 - If the message could not be deleted.
 * @throws 401 - If the user is not authenticated.
 */
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  const messageId = parseInt(req.params.id);

  try {
    // Delete the message
    const message = await prisma.message.delete({
      where: {
        id: messageId,
        userId: id, // Ensure user owns the message
      },
    });

    res.json({
      success: true,
      data: message,
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
 * @throws 500 - If the conversations could not be fetched.
 * @throws 401 - If the user is not authenticated.
 */
export const getConversations = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  try {
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
 * @returns success - true if the conversation was deleted successfully.
 * @throws 404 - If the conversation is not found.
 * @throws 500 - If the conversation could not be deleted.
 */
export const deleteConversation = async (req: Request, res: Response) => {
  const conversationId = parseInt(req.params.id);

  try {
    const { id } = (req as AuthenticatedRequest).user;
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

/**
 * POST /api/chat/prompt
 * @param prompt - The prompt to create.
 * @returns success - true if the prompt was created successfully.
 * @throws 500 - If the prompt could not be created.
 * @throws 401 - If the user is not authenticated.
 */
export const createPrompt = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const { id } = (req as AuthenticatedRequest).user;
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        ...prompt,
        userId: id,
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

/**
 * GET /api/chat/prompts
 * @returns prompts - The prompts for the user.
 * @throws 500 - If the prompts could not be fetched.
 * @throws 401 - If the user is not authenticated.
 */
export const getPrompts = async (req: Request, res: Response) => {
  try {
    const { id } = (req as AuthenticatedRequest).user;
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

/**
 * DELETE /api/chat/prompt/:id
 * @param id - The ID of the prompt to delete.
 * @returns success - true if the prompt was deleted successfully.
 * @throws 404 - If the prompt is not found.
 * @throws 500 - If the prompt could not be deleted.
 */
export const deletePrompt = async (req: Request, res: Response) => {
  const { id } = (req as AuthenticatedRequest).user;
  const { promptId } = req.params;
  try {
    const prompt = await prisma.prompt.delete({
      where: {
        id: parseInt(promptId),
        userId: id,
      },
    });

    res.json({
      success: true,
      data: prompt.id,
    });
  } catch (err) {
    console.error("Error deleting prompt:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete prompt",
    });
  }
};

/**
 * PATCH /api/chat/prompt/:id
 * @param id - The ID of the prompt to update.
 * @param prompt - The updated prompt data.
 * @returns success - true if the prompt was updated successfully.
 * @throws 500 - If the prompt could not be updated.
 * @throws 401 - If the user is not authenticated.
 */
export const updatePrompt = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const { id } = (req as AuthenticatedRequest).user;
  try {
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
