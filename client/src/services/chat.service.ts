import axios from "axios";
import {
  addConversation,
  addMessage,
  Conversation,
  Message,
  setConversation,
} from "../features/conversations.slice";
import { RootState } from "../store";
import { Dispatch, GetThunkAPI } from "@reduxjs/toolkit";

export interface ChatRequest {
  context: Message[];
  model: string;
  conversationId?: number;
}
const apiUrl = import.meta.env.VITE_API_URL;

const sendChatMessage = async (request: ChatRequest): Promise<string> => {
  const { context, model, conversationId } = request;
  try {
    const response = await axios.post(`${apiUrl}/api/chat/message`, {
      context,
      model,
      conversationId,
    });
    return response.data;
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
};

export const handleCreateTitle = async (
  content: string,
  model: string
): Promise<string> => {
  try {
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
    };

    const response = await sendChatMessage({
      context: [systemMessage, userMessage],
      model,
    });

    return response.trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return content;
  }
};

export const handleCreateConversation = async (
  message: string,
  model: string
): Promise<Conversation> => {
  const title = await handleCreateTitle(message, model);

  return {
    id: Date.now(),
    title,
    messages: [],
  };
};

export const handleSendMessage = async (
  { message, model }: { message: string; model: string },
  { dispatch, getState }: GetThunkAPI<{ state: RootState; dispatch: Dispatch }>
) => {
  const state = getState() as RootState;
  const { currentId } = state.conversations;

  const newMessage: Message = {
    id: Date.now(),
    content: message,
    role: "user",
  };

  if (!currentId) {
    // Create a new conversation with AI-generated title
    const newConversation = await handleCreateConversation(message, model);
    newConversation.messages = [newMessage];

    try {
      await axios.post(`${apiUrl}/api/chat/${newConversation.id}`, {
        conversation: newConversation,
      });
    } catch (err) {
      console.error(err, "error creating new conversation");
    }

    dispatch(
      addConversation({
        title: newConversation.title,
        message: newMessage,
        model,
      })
    );

    dispatch(setConversation(newConversation.id));

    const botResponse = await sendChatMessage({
      context: newConversation.messages,
      model,
    });

    try {
      await axios.patch(`${apiUrl}/api/chat/message`, {
        message: {
          content: botResponse,
          role: "assistant",
        },
        conversationId: newConversation.id,
      });
    } catch (err) {
      console.error(err, "unable to update conversation");
    }

    return {
      conversationId: newConversation.id,
      botMessage: botResponse,
    };
  } else {
    // If there's an active conversation, update the conversation
    dispatch(
      addMessage({
        conversationId: currentId,
        message: newMessage,
      })
    );

    const context =
      state.conversations.conversations.find((conv) => conv.id === currentId)
        ?.messages || [];

    const botResponse = await sendChatMessage({
      context: [...context, newMessage],
      model,
    });

    return {
      conversationId: currentId,
      botMessage: botResponse,
    };
  }
};
