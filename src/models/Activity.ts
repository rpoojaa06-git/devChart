import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);