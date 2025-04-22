import { Router } from "express";
import chatRoutes from "./chatRoutes";

const router = Router();

router.use("/chat", chatRoutes);

export default router;
