
import {
  saveTaskDocument,
} from "../services/document.service.js";

export const uploadTaskDocument = async (req, res, next) => {
  try {
    const document = await saveTaskDocument({
      taskId: req.params.taskId,
      currentUser: req.user,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};
