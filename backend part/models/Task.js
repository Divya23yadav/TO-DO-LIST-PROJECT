const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: Boolean
});

module.exports = mongoose.model("Task", taskSchema);