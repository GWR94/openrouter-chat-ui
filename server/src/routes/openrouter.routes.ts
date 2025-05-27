import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import {
  getCurrentCredits,
  modelSearch,
} from "../controllers/openrouter.controller";

const router = Router();

router.get("/credits", authenticateToken, getCurrentCredits);
router.get("/models", modelSearch);

export default router;
