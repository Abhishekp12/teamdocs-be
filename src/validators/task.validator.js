
import { body, param } from "express-validator";

export const createTaskValidation = [
  body("title")
      .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
      .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),

  body("assignedTo")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Assigned user ID must be a valid MongoDB ID"),
];

export const taskIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),
];
