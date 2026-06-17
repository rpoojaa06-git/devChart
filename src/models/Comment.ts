import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: "Anonymous",
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
