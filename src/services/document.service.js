
import mongoose from "mongoose";
import createError from "http-errors";
import { unlink } from "node:fs/promises";

import { findTaskById } from "../repositories/task.repository.js";
import { createDocument } from "../repositories/document.repository.js";

// Check whether the user can access this task.
export const assertTaskAccess = async (taskId, currentUser) => {
  if (!currentUser?._id || !currentUser?.role) {
    throw createError(401, "Authentication required");
  }

  if (!mongoose.isValidObjectId(taskId)) {
    throw createError(400, "Invalid task ID");
  }

  const task = await findTaskById(taskId);

  if (!task) {
    throw createError(404, "Task not found");
  }

  // Admin can access every task.
  if (currentUser.role === "admin") {
    return task;
  }

  const userId = currentUser._id.toString();

  const creatorId = task.createdBy?._id
    ? task.createdBy._id.toString()
    : task.createdBy?.toString();

  const assigneeId = task.assignedTo?._id
    ? task.assignedTo._id.toString()
    : task.assignedTo?.toString();

  if (creatorId !== userId && assigneeId !== userId) {
    throw createError(403, "You cannot access this task");
  }

  return task;
};

// Save the uploaded document's metadata.
export const saveTaskDocument = async ({
  taskId,
  currentUser,
  file,
}) => {
  if (!file) {
    throw createError(400, "Please upload a document");
  }

  try {
    // Check task access before saving metadata.
    await assertTaskAccess(taskId, currentUser);

    const document = await createDocument({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      task: taskId,
      uploadedBy: currentUser._id,
    });

    return document;
  } catch (error) {
    // Remove the saved file if authorization or metadata saving fails.
    if (file.path) {
      await unlink(file.path).catch(() => {});
    }

    throw error;
  }
};
