import { Router } from "express";
import chatRoutes from "./chat.routes";
import authRoutes from "./auth.routes";
import openrouterRoutes from "./openrouter.routes";
import authenticateToken from "../middleware/authenticateToken";

const router = Router();

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

router.use("/chat", authenticateToken, chatRoutes);
router.use("/auth", authRoutes);
router.use("/openrouter", openrouterRoutes);

export default router;
