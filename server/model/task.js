const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
});

module.exports = mongoose.model("Task", TaskSchema);
