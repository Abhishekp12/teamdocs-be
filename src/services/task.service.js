import mongoose from "mongoose";
import createError from "http-errors";
import User from "../models/user.js";

import {
  createTask as createTaskRepository,
  findTasks,
  countTasks,
  findTaskById,
  updateTaskById,
  deleteTaskById
} from "../repositories/task.repository.js";

const isValidId = (id) => mongoose.isValidObjectId(id);


const canAccessTask = (task, currentUser) => {
  // Admin can access every task.
  if (currentUser.role === "admin") {
    return true;
  }

  const userId = currentUser._id.toString();

  // Handle either populated documents or plain ObjectIds.
  const creatorId = task.createdBy?._id
    ? task.createdBy._id.toString()
    : task.createdBy?.toString();

  const assigneeId = task.assignedTo?._id
    ? task.assignedTo._id.toString()
    : task.assignedTo?.toString();

  // Manager and Employee can access tasks they created
  // or tasks assigned to them.
  return creatorId === userId || assigneeId === userId;
};



export const createTask = async (data,  currentUser) => {
  const {
    title,
    description,
    status,
    priority,
    assignedTo,

  } = data;
  // The creator comes from the verified JWT, not req.body.
  const createdBy = currentUser?._id;
  if (!isValidId(createdBy)) {
    throw createError(400, "A valid creator ID is required");
  }

  const creator = await User.findById(createdBy);

  if (!creator) {
    throw createError(400, "Creator does not exist");
  }

  if (assignedTo != null) {
    if (!isValidId(assignedTo)) {
      throw createError(400, "Invalid assigned user ID");
    }

    const assignee = await User.findById(assignedTo);

    if (!assignee) {
      throw createError(400, "Assigned user does not exist");
    }
  }

  return createTaskRepository({
    title,
    description,
    status,
    priority,
    assignedTo: assignedTo || null,
    createdBy
  });
};


export const getAllTasks = async (currentUser, query = {}) => {
  if (!currentUser?._id || !currentUser?.role) {
    throw createError(401, "Authentication required");
  }

  // Default values
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  // Validate pagination parameters
  if (!Number.isInteger(page) || page < 1) {
    throw createError(400, "Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw createError(400, "Limit must be between 1 and 100");
  }

  // Apply RBAC before fetching or counting tasks
  const filter =
    currentUser.role === "admin"
      ? {}
      : {
          $or: [
            { createdBy: currentUser._id },
            { assignedTo: currentUser._id },
          ],
        };

  const skip = (page - 1) * limit;

  // Run both database queries concurrently
  const [tasks, totalTasks] = await Promise.all([
    findTasks(filter, { skip, limit }),
    countTasks(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    },
  };
};



export const getTaskById = async (id, currentUser) => {
  if (!isValidId(id)) {
    throw createError(400, "Invalid task ID");
  }

  const task = await findTaskById(id);

  if (!task) {
    throw createError(404, "Task not found");
  }

  if (!canAccessTask(task, currentUser)) {
    throw createError(403, "You cannot access this task");
  }

  return task;
};



export const updateTask = async (id, data, currentUser) => {
  if (!isValidId(id)) {
    throw createError(400, "Invalid task ID");
  }

  // Find the task first.
  const existingTask = await findTaskById(id);

  if (!existingTask) {
    throw createError(404, "Task not found");
  }

  // Check access before updating.
  if (!canAccessTask(existingTask, currentUser)) {
    throw createError(403, "You cannot update this task");
  }

  // Only allow approved fields to be changed.
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "assignedTo",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  // Validate a new assignee if supplied.
  if (updates.assignedTo != null) {
    if (!isValidId(updates.assignedTo)) {
      throw createError(400, "Invalid assigned user ID");
    }

    const assignee = await User.findById(updates.assignedTo);

    if (!assignee) {
      throw createError(400, "Assigned user does not exist");
    }
  }

  const updatedTask = await updateTaskById(id, updates);

  return updatedTask;
};



export const deleteTask = async (id, currentUser) => {
  if (!isValidId(id)) {
    throw createError(400, "Invalid task ID");
  }

  const task = await findTaskById(id);

  if (!task) {
    throw createError(404, "Task not found");
  }

  if (!canAccessTask(task, currentUser)) {
    throw createError(403, "You cannot delete this task");
  }

  await deleteTaskById(id);

  return task;
};
