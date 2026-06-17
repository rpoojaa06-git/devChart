import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: true,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },

  dueDate: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo",
  },

  tags: {
    type: [String],
    default: [],
  },

  commentCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.pre('findOne', function() {
  this.populate('project').populate('event').populate('assignedTo');
});

TaskSchema.pre('find', function() {
  this.populate('project').populate('event').populate('assignedTo');
});

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);