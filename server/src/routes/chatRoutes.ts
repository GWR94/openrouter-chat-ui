import { Router } from "express";
import { sendChatMessage } from "../controllers/chatController";

const router = Router();

// Define the route for handling chat requests
router.post("/", sendChatMessage);

export default router;
