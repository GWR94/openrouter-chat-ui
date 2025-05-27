import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { handleModelSearch } from "../services/openrouter.service";
import { FreeModel, freeModels, models, PaidModel } from "../../data/models.ts";

export const modelSearch = createAsyncThunk(
  "models/modelSearch",
  async (
    params: { name?: string; maxPrice?: number; minContextLength?: number } = {}
  ) => {
    const { name, maxPrice, minContextLength } = params;
    return await handleModelSearch(name, maxPrice, minContextLength);
  }
);

interface ModelsState {
  items: PaidModel[] | FreeModel[];
  search: FreeModel[] | PaidModel[];
  isLoading: boolean;
  current: FreeModel | PaidModel;
  error: string | null;
}

const initialState: ModelsState = {
  items: [freeModels, models].flat(),
  search: [],
  current: freeModels[0],
  isLoading: false,
  error: null,
};

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    resetSearch(state) {
      state.search = [];
      state.isLoading = false;
      state.error = null;
    },
    setModel(state, action: PayloadAction<FreeModel | PaidModel>) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(modelSearch.fulfilled, (state, action) => {
        state.search = action.payload;
        // fixme
        state.error = null;
      })
      .addCase(modelSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(modelSearch.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to fetch models";
      });
  },
});

export const { resetSearch, setModel } = modelsSlice.actions;
export default modelsSlice.reducer;
