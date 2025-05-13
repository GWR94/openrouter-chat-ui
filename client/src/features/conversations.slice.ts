// src/features/conversations.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  handleSendMessage,
  handleCreateConversation,
} from "../services/chat.service";

export interface Message {
  id: number;
  content: string;
  role: MessageRole;
}

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  currentId: number | null;
  credits: {
    total: number;
    used: number;
  } | null;
}

const loadConversations = (): Conversation[] => {
  const savedConversations = localStorage.getItem("conversations");
  return savedConversations ? JSON.parse(savedConversations) : [];
};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem("conversations", JSON.stringify(conversations));
};

const initialState: ConversationsState = {
  conversations: loadConversations(),
  currentId: null,
  isLoading: false,
  error: null,
  credits: null,
};

export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  handleSendMessage
);

export const createConversation = createAsyncThunk(
  "conversations/createConversation",
  handleCreateConversation
);

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    addConversation: (
      state,
      action: PayloadAction<{
        title: string;
        message?: Message;
        model?: string;
      }>
    ) => {
      const { message, title } = action.payload;
      const newConversation: Conversation = {
        id: Date.now(),
        title,
        messages: message ? [message] : [],
      };
      state.conversations.push(newConversation);
      saveConversations(state.conversations);
    },
    deleteConversation: (state, action: PayloadAction<number | null>) => {
      state.conversations = state.conversations.filter(
        (conv) => conv.id !== action.payload
      );
      if (state.currentId === action.payload) {
        state.currentId = null;
      }
      saveConversations(state.conversations);
    },
    addMessage: (
      state,
      action: PayloadAction<{
        conversationId: number | null;
        message: Omit<Message, "id">;
      }>
    ) => {
      const conversation = state.conversations.find(
        (conv) => conv.id === state.currentId
      );
      const newMessage: Message = {
        id: Date.now(),
        ...action.payload.message,
      };
      conversation?.messages.push(newMessage);
      saveConversations(state.conversations);
    },
    setConversation: (state, action: PayloadAction<number | null>) => {
      state.currentId = action.payload;
      // state.isLoading = false;
      state.error = null;
      saveConversations(state.conversations);
    },
    setCredits: (
      state,
      action: PayloadAction<{ total_usage: number; total_credits: number }>
    ) => {
      const { total_credits, total_usage } = action.payload;
      state.credits = { total: total_credits, used: total_usage };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const botMessage = action.payload; // Assuming payload is the bot's response
        console.log(botMessage);
        const conversation = state.conversations.find(
          (conv) => conv.id === state.currentId
        );

        const newBotMessage: Message = {
          id: Date.now(),
          content: botMessage.botMessage, // Adjust based on actual response structure
          role: "assistant",
        };

        if (conversation) {
          conversation.messages.push(newBotMessage);
          saveConversations(state.conversations);
        }
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send message";
      });
  },
});

export const {
  addConversation,
  addMessage,
  setConversation,
  deleteConversation,
  setCredits,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
