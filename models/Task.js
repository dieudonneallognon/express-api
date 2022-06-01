const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    faite: {
        type: Boolean,
        required: true,
    },
    creePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
