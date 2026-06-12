import fs from "node:fs";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

fs.mkdirSync(env.UPLOAD_PATH, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, env.UPLOAD_PATH),
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    callback(null, `${Date.now()}-${randomUUID()}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_BYTES,
    files: 5
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
    if (!allowedTypes.has(file.mimetype)) {
      return callback(new ApiError(StatusCodes.BAD_REQUEST, "Only image and PDF evidence files are allowed"));
    }
    callback(null, true);
  }
});
