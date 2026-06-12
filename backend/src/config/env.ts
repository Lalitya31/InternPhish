import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(5)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const values = parsed.data;

export const env = {
  ...values,
  CORS_ORIGINS: values.CORS_ORIGIN === "*" ? "*" : values.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  UPLOAD_PATH: path.resolve(process.cwd(), values.UPLOAD_DIR),
  MAX_FILE_SIZE_BYTES: values.MAX_FILE_SIZE_MB * 1024 * 1024
};
