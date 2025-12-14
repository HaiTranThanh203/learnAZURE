const Employee = require("../models/Employee.model");

/**
 * Controller for Employee CRUD
 * Assumes a Mongoose model at ../models/Employee.model.js
 */

exports.create = async (req, res) => {
  try {
    const { name, email, phone, position, salary, department, status } =
      req.body;

    if (!name || !email || !position) {
      return res
        .status(400)
        .json({ message: "Name, email, and position are required" });
    }

    const employee = new Employee({
      name,
      email,
      phone,
      position,
      salary,
      department,
      status,
    });
    const saved = await employee.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    return res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await Employee.deleteMany({});
    return res.json({ message: "All employees deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
