
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import createError from "http-errors";

// Store uploads in the backend project directory.
const uploadDir = path.resolve(
  process.cwd(),
  "uploads",
  "documents"
);

// Create the folder if it doesn't exist.
fs.mkdirSync(uploadDir, { recursive: true });

// Allow only these document formats.
const allowedTypes = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [
    ".docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
]);

// Decide where and how the file is saved.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    // Never use the client's filename as the stored filename.
    cb(null, `${randomUUID()}${extension}`);
  },
});

// Check the file extension and declared MIME type.
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const expectedMimeType = allowedTypes.get(extension);

  if (!expectedMimeType || file.mimetype !== expectedMimeType) {
    return cb(
      createError(400, "Only PDF, DOC, and DOCX files are allowed")
    );
  }

  cb(null, true);
};

export const uploadDocument = multer({
  storage,
  fileFilter,

  // Limit uploads to 5 MB and one file per request.
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 5,
    parts: 6,
  },
});
