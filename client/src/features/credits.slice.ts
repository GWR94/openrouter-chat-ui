import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { handleCheckCredits } from "../services/openrouter.service";

export const checkCredits = createAsyncThunk(
  "openRouter/checkCredits",
  handleCheckCredits
);

interface CreditsState {
  total: number;
  used: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CreditsState = {
  total: 0,
  used: 0,
  isLoading: false,
  error: null,
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        checkCredits.fulfilled,
        (
          state,
          action: PayloadAction<{ total_usage: number; total_credits: number }>
        ) => {
          const { total_credits, total_usage } = action.payload;
          state.total = total_credits;
          state.used = total_usage;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(checkCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkCredits.rejected, (state) => {
        state.total = 0;
        state.used = 0;
        state.isLoading = false;
        state.error = "Failed to fetch credits";
      });
  },
});

export default creditsSlice.reducer;
