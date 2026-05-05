const Performance = require("../models/Performance");

exports.addPerformance = async (req, res) => {
  const data = await Performance.create(req.body);
  res.json(data);
};

exports.getPerformance = async (req, res) => {
  const data = await Performance.find().populate("employeeId");
  res.json(data);
};