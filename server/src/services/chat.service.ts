import prisma from "../config/prisma.config";
import { getChatResponse } from "../utils/openrouter";

interface CreateConversationRequest {
  content: string;
  userId?: number;
  model: string;
}

/**
 * Creates a new conversation with the first message.
 * @param content - The content of the first message.
 * @param userId - The ID of the user creating the conversation.
 * @param model - The model to use for generating the title.
 * @returns The created conversation with the first message.
 */
export const createConversationWithMessage = async ({
  content,
  userId,
  model = "anthropic/claude-3.5-haiku",
}: CreateConversationRequest) => {
  try {
    const title = await createTitle({ content, userId, model });

    return await prisma.$transaction(
      async (tx) => {
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
      },
      {
        // timeout: 10000,
      }
    );
  } catch (error) {
    console.error("Error creating conversation with message:", error);
    throw error;
  }
};

export interface Message {
  id: number;
  role: string;
  content: string;
  userId?: number;
}

interface CreateTitleRequest {
  model: string;
  content: string;
  userId?: number;
}

/**
 * Generates a title for a conversation based on the first message.
 * @param model - The model to use for generating the title.
 * @param content - The content of the first message.
 * @param userId - The ID of the user (optional).
 * @returns The generated title.
 */
export const createTitle = async ({
  model,
  content,
  userId,
}: CreateTitleRequest): Promise<string> => {
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

  try {
    const title = await getChatResponse({
      model,
      context: [systemMessage, userMessage],
    });
    return title.trim();
  } catch (err) {
    console.error("Error generating title", err);
    return content;
  }
};
