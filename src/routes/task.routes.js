import {Router} from 'express';
import {
createTask,
getAllTasks,
getTaskById,
updateTask,
deleteTask
}from "../controllers/task.controller.js";

import { validateRequest } from "../middlewares/validate.middleware.js";

import {
  createTaskValidation,
  taskIdValidation,
} from "../validators/task.validator.js";

const router = Router();

// router.post("/", createTask);
router.post(
  "/",
  createTaskValidation,
  validateRequest,
  createTask
);
router.get("/", getAllTasks);
router.get("/:id",
  taskIdValidation,
  validateRequest, getTaskById);
router.patch("/:id",   taskIdValidation,
  validateRequest,updateTask);
router.delete("/:id",  taskIdValidation,
  validateRequest, deleteTask);

export default router;