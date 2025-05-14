import { User } from "./../middleware/authenticateToken";
import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateTokens } from "../services/auth.service";
import prisma from "../config/prisma.config";
import { findUser } from "../services/user.service";

const SALT_ROUNDS = 10;
const accessTokenConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only HTTPS in production
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  domain:
    process.env.NODE_ENV === "production" ? process.env.FRONT_END : "localhost",
  maxAge: 15 * 60 * 1000, // 15 minutes
};
const refreshTokenConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only HTTPS in production
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  domain:
    process.env.NODE_ENV === "production" ? process.env.FRONT_END : "localhost",
  path: "/api/user/refresh",
};

/**
 * POST /api/auth/register
 * Register a new user
 * @param username - The username of the user to register
 * @param password - The password of the user to register
 * @param name - The display name of the user to register
 * @returns The user object if registration is successful
 * @throws Error if the user already exists or if there is an error
 * during the process
 */
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, name } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists && userExists.hashedPassword) {
      res.status(409).json({ message: "User already exists. Please login." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (userExists) {
      // if user exists, update it to allow login via OAuth or username/password
      const updatedUser = await prisma.user.update({
        where: { username },
        data: {
          hashedPassword,
        },
      });

      res.status(201).json({
        message: "User registered successfully (Merged)",
        user: { id: updatedUser.id, username: updatedUser.username },
      });
      return;
    }

    // If all others are not true, create a new user
    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
        displayName: name,
      },
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user", error: err });
  }
};

/**
 * POST /api/auth/verify
 * Helper function to verify the user is via JWT
 * @param accessToken - The JWT token to verify
 * @returns The user object if found, otherwise null
 * @throws Error if the user is not found or if there is an
 * error during the process
 */
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      res.status(401).json({
        success: false,
        error: "Unauthorized - No Access Token",
      });
      return;
    }

    const decodedUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as User;

    const user = await findUser(decodedUser);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
      return;
    }

    const { hashedPassword, ...safeUser } = user;
    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to verify user",
    });
  }
};

/**
 * GET /api/auth/:username
 * Log in a user and provide a JWT
 * @param username - The username of the user to find
 * @returns The user object if found, otherwise null
 * @throws Error if the user is not found or if there is an error during
 * the process
 */
export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await findUser({ username });
    console.log(user);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
};

/**
 * POST /api/auth/login
 * Log in a user and provide a JWT
 * @param username - The username of the user to log in
 * @param password - The password of the user to log in
 * @param rememberMe - Whether to remember the user for 30 days
 * @returns A message indicating the result of the login attempt
 * with a JWT cookie set if successful.
 * @throws Error if the user is not found or if the password is invalid.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { username, password, rememberMe = false } = req.body;
  try {
    const user = await findUser({ username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.hashedPassword) {
      res.status(422).json({
        error: "Wrong authentication method. Please use OAuth.",
        success: false,
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
      return;
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if (rememberMe) {
      refreshTokenConfig.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, accessTokenConfig);
    res.cookie("refreshToken", refreshToken, refreshTokenConfig);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
    return;
  }
};

/**
 * POST /api/auth/logout
 * Log out a user by clearing the JWT cookie
 * @returns A message indicating the result of the logout attempt
 * with the JWT cookies cleared if successful.
 */
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({
    success: true,
  });
};

/**
 * GET /api/auth/[provider]/callback
 * Handle OAuth callback and set JWT cookie, then redirect to the front end
 * @param user - The user object returned from the OAuth provider
 * @returns Redirects to the front end with the JWT cookie set
 * @throws Error if the user is not found or if there is an error during the process
 */
export const setOAuthTokensThenRedirect = (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    if (!user) {
      res.status(400).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, accessTokenConfig);
    res.cookie("refreshToken", refreshToken, refreshTokenConfig);
    res.redirect(process.env.FRONT_END as string);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Couldn't complete OAuth",
    });
  }
};

/**
 * GET /api/auth/refresh
 * Refresh the JWT token using the refresh token cookie
 * @param refreshToken - The refresh token to verify and use to generate new tokens.
 * @returns New access and refresh tokens with a message, if successful.
 * @throws Error if the refresh token is invalid or the user is not found.
 */
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res
      .status(401)
      .json({ error: "Unauthorized - No Refresh Token", success: false });
    return;
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as User;

  try {
    const user = await findUser(decoded);

    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "Unauthorized - User not found" });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, accessTokenConfig);
    res.cookie("refreshToken", newRefreshToken, refreshTokenConfig);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to refresh tokens" });
  }
};
