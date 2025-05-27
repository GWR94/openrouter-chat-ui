import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector as useSelector } from "../hooks/redux";
import Message from "./Message";
import LoadingMessage from "./LoadingMessage";

const Messages: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isLoading, conversations, currentId } = useSelector(
    (state) => state.chat
  );
  const messages = React.useMemo(
    () => conversations.find((conv) => conv.id === currentId)?.messages || [],
    [conversations, currentId]
  );

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
