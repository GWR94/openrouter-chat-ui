import React from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface MessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const Messages: React.FC<MessagesProps> = ({ messages, isLoading }) => (
  <div className="messages">
    {messages.map((msg, i) => (
      <div key={i} className={`message ${msg.sender}`}>
        {msg.text}
      </div>
    ))}
    {isLoading && <div className="message bot">Thinking...</div>}
  </div>
);

export default Messages;
