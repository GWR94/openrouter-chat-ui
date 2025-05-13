import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import { getCurrentCredits } from "../controllers/credits.controller";

const router = Router();

router.get("/", authenticateToken, getCurrentCredits);

export default router;
