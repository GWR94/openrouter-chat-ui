import { Router } from "express";
import chatRoutes from "./chat.routes";
import authRoutes from "./auth.routes";
import creditRoutes from "./credits.routes";

const router = Router();

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

router.use("/chat", chatRoutes);
router.use("/auth", authRoutes);
router.use("/credits", creditRoutes);

export default router;
