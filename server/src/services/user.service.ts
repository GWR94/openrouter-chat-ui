import prisma from "../config/prisma.config";

/**
 * Helper function to find a user by its id
 * @param id - The id of the user to find
 * @returns The user object if found, otherwise null
 * @throws Error if there is an error during the process or
 * if the user is not found.
 */
export const findUserById = async (id: number) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Helper function to find a user by its username
 * @param username - The username of the user to find
 * @returns The user object if found, otherwise null
 * @throws Error if there is an error during the process or
 * if the user is not found.
 */
export const findUserByUsername = async (username: string) => {
  try {
    return await prisma.user.findUnique({
      where: { username },
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
