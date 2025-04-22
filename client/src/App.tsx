import { useState } from "react";
import ChatBox from "./components/ChatBox";
import Messages from "./components/Messages";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  return (
    <div className="chat-container">
      <Messages messages={messages} isLoading={isLoading} />
      <ChatBox addMessage={addMessage} setIsLoading={setIsLoading} />
    </div>
  );
};

export default App;
