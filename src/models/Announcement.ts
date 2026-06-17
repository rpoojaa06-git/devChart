import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  priority: {
    type: String,
    enum: ["low", "normal", "high"],
    default: "normal",
  },

  isPinned: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);