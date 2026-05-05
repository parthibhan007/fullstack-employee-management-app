const Employee = require("../models/Employee");
const calculateRisk = require("../utils/riskCalculator");

exports.createEmployee = async (req, res) => {
  const { name, role, department, salary, attendance, rating } = req.body;

  const riskLevel = calculateRisk(attendance, rating);

  const employee = await Employee.create({
    name,
    role,
    department,
    salary,
    attendance,
    rating,
    riskLevel
  });

  res.json(employee);
};

exports.getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

exports.getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.json(employee);
};

exports.updateEmployee = async (req, res) => {
  const { attendance, rating } = req.body;

  if (attendance && rating) {
    req.body.riskLevel = calculateRisk(attendance, rating);
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(employee);
};

exports.deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ msg: "Employee deleted" });
};