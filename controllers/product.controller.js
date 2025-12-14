const Product = require("../models/Product.model");

/**
 * Controller for Product CRUD
 * Assumes a Mongoose model at ../models/Product.model.js
 */

exports.create = async (req, res) => {
  try {
    const { name, description, price, quantity,  status } =
      req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Name, price are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      status,
    });
    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await Product.deleteMany({});
    return res.json({ message: "All products deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
