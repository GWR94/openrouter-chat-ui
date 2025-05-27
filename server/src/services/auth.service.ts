import { sign } from "jsonwebtoken";
import { User } from "../middleware/authenticateToken";

export const generateTokens = (user: Partial<User>) => {
  const { id, username, facebookId, googleId, githubId } = user;
  const payload: Partial<User> = {
    id,
    username,
    facebookId,
    googleId,
    githubId,
  };

  const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });

  const refreshToken = sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" } // Longer lifetime
  );

  return { accessToken, refreshToken };
};
