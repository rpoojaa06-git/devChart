import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["President", "Vice President", "Treasurer", "Secretary", "Member"],
      default: "Member",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    skills: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Member ||
  mongoose.model("Member", MemberSchema);
