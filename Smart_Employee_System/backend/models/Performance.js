const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  tasksCompleted: Number,
  attendance: Number,
  rating: Number,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);