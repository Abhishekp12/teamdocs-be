
import Task from "../models/task.js";

// CREATE
export const createTask = (data) => {
  return Task.create(data);
};

// GET ALL
export const findAllTasks = () => {
  return Task.find()
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// GET BY ID
export const findTaskById = (id) => {
  return Task.findById(id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
};

// UPDATE
export const updateTaskById = (id, data) => {
  return Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

// new: true	Return the updated document
// runValidators: true	Run applicable Mongoose schema validators on the update
// Without new: true, Mongoose normally returns the document from before the update. With it, you get the updated document.
// runValidators: true is useful because it checks rules such as allowed status values in your Task schema

// It tells Mongoose:
// - "assignedTo" — follow the reference defined in the Task schema.
// - "name email" — return only the referenced user's name and email, along with the document's _id

};

// DELETE
export const deleteTaskById = (id) => {
  return Task.findByIdAndDelete(id);
};

export const findTasksForUser = (userId) =>
  Task.find({
    $or: [
      { createdBy: userId },
      { assignedTo: userId },
    ],
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });


// GET TASKS WITH PAGINATION
export const findTasks = (filter, { skip, limit }) => {
  return Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// COUNT MATCHING TASKS
export const countTasks = (filter) => {
  return Task.countDocuments(filter);
};


