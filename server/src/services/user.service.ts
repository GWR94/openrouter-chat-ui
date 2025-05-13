import prisma from "../config/prisma.config";
import { User } from "../middleware/authenticateToken";

/**
 * Helper function to find a user by username or OAuth ID
 * @param user - Partial of user object of the user to find
 * @returns The user object if found, otherwise null
 * @throws Error if there is an error during the process or
 * if the user is not found.
 */
export const findUser = async (user: Partial<User>) => {
  try {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { username: user?.username },
          { googleId: user?.googleId },
          { facebookId: user?.facebookId },
          { githubId: user?.githubId },
        ],
      },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
