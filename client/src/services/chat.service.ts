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
import { ConstructionOutlined } from "@mui/icons-material";

interface ApiRequest {
  context: Message[];
  model: string;
  conversationId?: number;
}

interface MessageRequest {
  content: string;
  model: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const sendChatMessage = async ({
  context,
  model,
  conversationId,
}: ApiRequest): Promise<string> => {
  try {
    const response = await axios.post(`${apiUrl}/api/chat/message`, {
      context,
      model,
      conversationId,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
};

const createConversation = async ({ content, model }: MessageRequest) => {
  try {
    const response = await axios.post(`${apiUrl}/api/chat/conversation`, {
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

export const handleCreateConversation = async (
  { content, model }: MessageRequest,
  { dispatch }: GetThunkAPI<{ state: RootState }>
) => {
  const conversation = await createConversation({ content, model });
  dispatch(
    addConversation({
      title: conversation.title,
      model,
      message: conversation.messages[0],
    })
  );
  dispatch(setConversation(conversation.id));

  const botResponse = await sendChatMessage({
    context: conversation.messages,
    model,
    conversationId: conversation.id,
  });

  dispatch(addMessage({ message: botResponse, role: "assistant" }));
};

export const handleSendMessage = async (
  { content, model }: MessageRequest,
  { dispatch, getState }: GetThunkAPI<{ state: RootState; dispatch: Dispatch }>
) => {
  const state = getState() as RootState;
  const { currentId } = state.conversations;

  const newMessage: Message = {
    id: Date.now(),
    content,
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
