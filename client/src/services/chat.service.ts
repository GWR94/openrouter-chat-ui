import axios from "../config/axios.config";
import { Message } from "../features/chat.slice";
import { Prompt } from "../features/prompts.slice";
import { RootState } from "../store";
import { GetThunkAPI } from "@reduxjs/toolkit";

interface MessageRequest {
  content: string;
  model: string;
}

interface HandleMessageRequest {
  message: Message;
  model: string;
}

// MESSAGES

export const handleGetChatResponse = async (
  { message, model }: HandleMessageRequest,
  { getState }: GetThunkAPI<{ state: RootState }>
) => {
  const state = getState() as RootState;
  const { currentId } = state.chat;

  if (!currentId) {
    throw new Error("No current conversation ID found");
  }

  const context =
    state.chat.conversations.find((conv) => conv.id === currentId)?.messages ||
    [];

  const response = await axios.post(`/chat/message`, {
    context: [...context, message],
    model,
    conversationId: currentId,
  });

  return response.data;
};

export const handleDeleteMessage = async (messageId: number) => {
  try {
    const response = await axios.delete(`/chat/message/${messageId}`);
    return {
      messageId,
      conversationId: response.data.message.conversationId,
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// CONVERSATIONS

export const handleGetAllConversations = async () => {
  try {
    const response = await axios.get(`/chat/conversations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const handleCreateConversation = async ({
  content,
  model,
}: MessageRequest) => {
  try {
    const response = await axios.post(`/chat/conversation`, {
      content,
      model,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
};

export const handleDeleteConversation = async (id: number) => {
  try {
    await axios.delete(`/chat/conversation/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

// PROMPTS

export const handleCreatePrompt = async (prompt: Omit<Prompt, "id">) => {
  try {
    const response = await axios.post(`/chat/prompt`, {
      prompt,
    });
    console.log("Prompt created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating prompt:", error);
    throw error;
  }
};

export const handleUpdatePrompt = async (prompt: Prompt) => {
  try {
    const response = await axios.patch(`/chat/prompt`, {
      prompt,
    });
    console.log("Prompt updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw error;
  }
};

export const handleGetPrompts = async () => {
  try {
    const response = await axios.get(`/chat/prompts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw error;
  }
};

export const handleDeletePrompt = async (id: number) => {
  try {
    const response = await axios.delete(`/chat/prompt/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting prompt:", error);
    throw error;
  }
};
