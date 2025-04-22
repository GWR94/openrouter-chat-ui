import { useState } from "react";
import axios from "axios";
import models from "../../data/models"; // Assuming models are defined in models.ts

interface ChatBoxProps {
  addMessage: (text: string, sender: "user" | "bot") => void;
  setIsLoading: (loading: boolean) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ addMessage, setIsLoading }) => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(""); // Default to the first model

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage(input, "user");
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/chat", {
        message: input,
        model,
      });
      console.log("Response:", response.data.choices[0].message);
      addMessage(response.data.choices[0].message.content, "bot");
    } catch (error) {
      console.error("Error:", error);
      addMessage("Error getting response", "bot");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        {models.map((model) => (
          <option key={model.model} value={model.model}>
            {model.name}
          </option>
        ))}
      </select>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatBox;
