import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["planning", "in-progress", "on-hold", "completed"],
        default: "planning",
    },

    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },

    deadline: {
        type: Date,
    },

    members: {
        type: [String],
        default: [],
    },

    tags: {
        type: [String],
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project =
    mongoose.models.Project ||
    mongoose.model("Project", ProjectSchema);

export default Project;