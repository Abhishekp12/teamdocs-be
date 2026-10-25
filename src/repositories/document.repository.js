
import TaskDocument from "../models/document.js";

// Save document metadata in MongoDB.
export const createDocument = (data) => {
  return TaskDocument.create(data);
};

// Find all documents attached to a specific task.
export const findDocumentsByTask = (taskId) => {
  return TaskDocument.find({ task: taskId })
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });
};

// Find one document by its MongoDB ID.
export const findDocumentById = (id) => {
  return TaskDocument.findById(id)
    .populate("uploadedBy", "name email")
    .populate("task", "title");
};

// Delete document metadata from MongoDB.
export const deleteDocumentById = (id) => {
  return TaskDocument.findByIdAndDelete(id);
};
