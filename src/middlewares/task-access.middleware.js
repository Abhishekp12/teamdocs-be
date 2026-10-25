
import {
  assertTaskAccess,
} from "../services/document.service.js";

export const checkTaskAccess = async (req, res, next) => {
  try {
    await assertTaskAccess(req.params.taskId, req.user);

    next();
  } catch (error) {
    next(error);
  }
};
