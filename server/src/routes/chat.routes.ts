import { Router } from "express";
import {
  createConversation,
  sendChatMessage,
} from "../controllers/chat.controller";

const router = Router();

// Define the route for handling chat requests
router.post("/", sendChatMessage);
router.post("/:id", createConversation);
router.patch("/:id");

export default router;
