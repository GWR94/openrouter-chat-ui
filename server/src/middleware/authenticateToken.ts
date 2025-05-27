import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface User {
  id: number;
  username: string;
  hashedPassword?: string | null;
  facebookId?: string | null;
  googleId?: string | null;
  githubId?: string | null;
  displayName?: string | null;
}

/**
 * Helper function to authenticate without ts errors
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  authenticateTokenWithAuth(authReq, res, next);
};

/**
 * Middleware to authenticate a user using JWT
 */
const authenticateTokenWithAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      res.status(401).json({ error: "No access token", success: false });
      return;
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as User;

    req.user = decoded;
    return next();
  } catch (error) {
    res
      .status(403)
      .json({ error: "Invalid or expired access token", success: false });
    return;
  }
};

export default authenticateToken;
