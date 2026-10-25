
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    storedName: {
      type: String,
      required: true,
      unique: true,
    },

    mimeType: {
      type: String,
      required: true,
      enum: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },

    size: {
      type: Number,
      required: true,
      min: 1,
      max: 5 * 1024 * 1024,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Efficiently find a task's documents, newest first.
documentSchema.index({ task: 1, createdAt: -1 });

const TaskDocument = mongoose.model("TaskDocument", documentSchema);

export default TaskDocument;
