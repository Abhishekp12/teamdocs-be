
import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { checkTaskAccess } from "../middlewares/task-access.middleware.js";
import { uploadDocument } from "../middlewares/upload.middleware.js";

import {
  uploadTaskDocument,
} from "../controllers/document.controller.js";

const router = Router();

router.post(
  "/tasks/:taskId/documents",
  authenticate,
  checkTaskAccess,
  uploadDocument.single("document"),
  uploadTaskDocument
);

export default router;
