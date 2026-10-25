import {
  createTask as createTaskService,
  getAllTasks as getAllTasksService,
  getTaskById as getTaskByIdService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService
} from "../services/task.service.js";

export const createTask = async (req, res, next) => {
    console.log("### NEW CREATE TASK CONTROLLER RUNNING ###");
  try {

    const task = await createTaskService(req.body,  req.user);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const result = await getAllTasksService(req.user, req.query);

    res.status(200).json({
      success: true,
      count: result.tasks.length,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
  const task = await getTaskByIdService(
  req.params.id,
  req.user
);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService(
      req.params.id,
      req.body,
        req.user
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
   const task = await deleteTaskService(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};