import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector as useSelector } from "../hooks/redux";
import Message from "./Message";
import LoadingMessage from "./LoadingMessage";

const Messages: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useSelector(
    (state) =>
      state.conversations.conversations.find(
        (conv) => conv.id === state.conversations.currentId
      )?.messages || []
  );

  const { isLoading } = useSelector((state) => state.conversations);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {messages.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Start a conversation by typing a message below
          </Typography>
        </Box>
      )}

      {messages.map(({ content, role }, i) => (
        <Message key={i} content={content} role={role} />
      ))}

      {isLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />
    </Box>
  );
};

export default Messages;
