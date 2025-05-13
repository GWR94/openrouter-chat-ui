import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import errorHandler from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config";

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per IP
});

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

app.use((req, res, next) => {
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

app.use("/api", routes);

app.use(errorHandler);

app.use(passport.initialize());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
