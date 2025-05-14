import { Router } from "express";
import {
  createMessage,
  getMessages,
  deleteMessage,
  getConversations,
  deleteConversation,
  createPrompt,
  deletePrompt,
  updatePrompt,
  getPrompts,
  createConversation,
} from "../controllers/chat.controller";

const router = Router();

// MESSAGES
router.post("/message", createMessage);
router.get("/messages/:id", getMessages);
router.delete("/message/:id", deleteMessage);

// CONVERSATIONS
router.post("/conversation", createConversation);
router.delete("/conversation/:id", deleteConversation);
router.get("/conversations", getConversations);

// PROMPTS
router.post("/prompt", createPrompt);
router.patch("/prompt", updatePrompt);
router.delete("/prompt/:id", deletePrompt);
router.get("/prompts", getPrompts);

export default router;
