import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { env } from "./config/env";
import { apiRouter } from "./routes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true
  })
);
app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(env.UPLOAD_PATH)));

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);
