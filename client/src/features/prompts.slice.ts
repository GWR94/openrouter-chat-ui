import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  handleCreatePrompt,
  handleDeletePrompt,
  handleGetPrompts,
  handleUpdatePrompt,
} from "../services/chat.service";

export interface Prompt {
  id?: number;
  name: string;
  content: string;
  description?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  isSystem?: boolean;
  userId?: number;
}

interface PromptsState {
  items: Prompt[];
  isLoading: boolean;
  error: string | null;
  active: Prompt[];
}

const initialState: PromptsState = {
  items: [],
  isLoading: false,
  error: null,
  active: [],
};

export const getPrompts = createAsyncThunk(
  "prompts/getPrompts",
  handleGetPrompts
);

export const createPrompt = createAsyncThunk(
  "prompts/createPrompt",
  handleCreatePrompt
);

export const updatePrompt = createAsyncThunk(
  "prompts/updatePrompt",
  handleUpdatePrompt
);

export const deletePrompt = createAsyncThunk(
  "prompts/deletePrompt",
  handleDeletePrompt
);

const promptsSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    setPromptActive: (state, action) => {
      const prompt = action.payload;
      if (state.active.some((p) => p.id === prompt.id)) {
        state.active = state.active.filter((p) => p.id !== prompt.id);
      } else {
        state.active.push(prompt);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrompts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPrompts.fulfilled, (state, action) => {
        const prompts = action.payload.data;
        state.items = prompts;
        state.isLoading = false;
      })
      .addCase(getPrompts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch prompts";
      })
      .addCase(createPrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPrompt.fulfilled, (state, action) => {
        const prompt = action.payload.data;
        state.items.push(prompt);
        state.isLoading = false;
      })
      .addCase(createPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create prompt";
      })
      .addCase(updatePrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePrompt.fulfilled, (state, action) => {
        const updatedPrompt = action.payload.data;
        const index = state.items.findIndex(
          (prompt) => prompt.id === updatedPrompt.id
        );
        if (index !== -1) {
          state.items[index] = updatedPrompt;
        }
        state.isLoading = false;
      })
      .addCase(updatePrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update prompt";
      })
      .addCase(deletePrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePrompt.fulfilled, (state, action) => {
        const deletedId = action.payload.data;
        state.items = state.items.filter((prompt) => prompt.id !== deletedId);
        state.isLoading = false;
      })
      .addCase(deletePrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete prompt";
      });
  },
});
export const { setPromptActive } = promptsSlice.actions;
export default promptsSlice.reducer;
