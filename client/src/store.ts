import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chat.slice";
import authReducer from "./features/auth.slice";
import creditsReducer from "./features/credits.slice";
import modelsReducer from "./features/models.slice";
import promptsReducer from "./features/prompts.slice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    credits: creditsReducer,
    models: modelsReducer,
    prompts: promptsReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
