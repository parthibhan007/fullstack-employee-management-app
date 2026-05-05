const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String,
  salary: Number,
  attendance: Number,
  rating: Number,
  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);