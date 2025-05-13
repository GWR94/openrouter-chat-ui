// src/hooks/redux.ts - Create a custom typed hook
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCurrentConversationMessages = () => {
  return useSelector((state: RootState) => {
    const currentId = state.conversations.currentId;
    const currentConversation = state.conversations.conversations.find(
      (conv) => conv.id === currentId
    );
    return currentConversation ? currentConversation.messages : [];
  });
};
