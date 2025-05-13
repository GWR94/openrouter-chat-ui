import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  setOAuthTokensThenRedirect,
} from "../controllers/auth.controller";
import passport from "passport";
import { AuthenticatedRequest } from "../middleware/authenticateToken";

export const router = Router();

router.get("/", getUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/login", loginUser);

// passport
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/login/google/callback",
  passport.authenticate("google", { session: false }),
  setOAuthTokensThenRedirect
);
router.get("/login/facebook", passport.authenticate("facebook"));
router.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  setOAuthTokensThenRedirect
);
router.get("/login/github", passport.authenticate("github"));
router.get(
  "/login/github/callback",
  passport.authenticate("github", { session: false }),
  setOAuthTokensThenRedirect
);

export default router;
