import { configureStore } from "@reduxjs/toolkit";
import conversationsReducer from "./features/conversations.slice";
import authReducer from "./features/auth.slice";

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    auth: authReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
