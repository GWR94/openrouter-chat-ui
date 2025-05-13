import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCredits } from "../services/credits.service";

export const checkCredits = createAsyncThunk("auth/checkCredits", getCredits);

interface CreditState {
  total: number;
  used: number;
  isLoading: boolean;
}

const initialState: CreditState = {
  total: 0,
  used: 0,
  isLoading: false,
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setCredits(state, action: PayloadAction<{ total: number; used: number }>) {
      state.total = action.payload.total;
      state.used = action.payload.used;
    },
  },
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
        }
      )
      .addCase(checkCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkCredits.rejected, (state) => {
        state.total = 0;
        state.used = 0;
        state.isLoading = false;
      });
  },
});

export const { setCredits } = creditsSlice.actions;
export default creditsSlice.reducer;
