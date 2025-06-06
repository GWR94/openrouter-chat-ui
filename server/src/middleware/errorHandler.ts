import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  status?: number;
}

const errorHandler = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error", success: false });
};

export default errorHandler;
