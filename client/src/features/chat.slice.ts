// src/features/conversations.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  handleGetChatResponse,
  handleCreateConversation,
  handleGetAllConversations,
  handleDeleteConversation,
  handleDeleteMessage,
} from "../services/chat.service";

export interface Message {
  id?: number;
  content: string;
  role: MessageRole;
}

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  currentId: number | null;
}

export const getChatResponse = createAsyncThunk(
  "chat/getChatResponse",
  handleGetChatResponse
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  handleDeleteMessage
);

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  handleCreateConversation
);

export const getAllConversations = createAsyncThunk(
  "chat/getAllConversations",
  handleGetAllConversations
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  handleDeleteConversation
);

const initialState: ChatState = {
  conversations: [],
  currentId: null,
  isLoading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{
        conversationId: number | null;
        message: Message;
        model: string;
      }>
    ) => {
      const { message, model } = action.payload;
      const chat = state.conversations.find(
        (conv) => conv.id === state.currentId
      );
      chat?.messages.push(message);
      getChatResponse({ message, model });
    },
    setConversation: (state, action: PayloadAction<number | null>) => {
      state.currentId = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatResponse.fulfilled, (state, action) => {
        const { message } = action.payload;
        const conversation = state.conversations.find(
          (conv) => conv.id === state.currentId
        );
        conversation?.messages.push(message);
        state.isLoading = false;
      })
      .addCase(getChatResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send message";
      })
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId, conversationId } = action.payload;
        const conversation = state.conversations.find(
          (conv) => conv.id === conversationId
        );
        if (conversation) {
          conversation.messages = conversation.messages.filter(
            (msg) => msg.id !== messageId
          );
        }
        state.isLoading = false;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete message";
      })
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const { conversation } = action.payload;
        state.conversations.push(conversation);
        state.currentId = conversation.id;
        state.isLoading = false;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to create conversation";
      })
      .addCase(getAllConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllConversations.fulfilled, (state, action) => {
        const { conversations } = action.payload;
        state.conversations = conversations;
        state.isLoading = false;
      })
      .addCase(getAllConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch conversations";
      })

      .addCase(deleteConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const conversationId = action.payload;
        state.conversations = state.conversations.filter(
          (conv) => conv.id !== conversationId
        );
        if (state.currentId === conversationId) {
          state.currentId = null;
        }
        state.isLoading = false;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to delete conversation";
      });
  },
});

export const { addMessage, setConversation } = chatSlice.actions;
export default chatSlice.reducer;
