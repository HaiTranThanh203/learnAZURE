const Todo = require('../models/Todo.model');

/**
 * Controller for Todo CRUD
 * Assumes a Mongoose model at ../models/todo.model.js
 */

exports.create = async (req, res) => {
    try {
        console.log('req.body', req.body);
        
        const { title, description, completed } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const todo = new Todo({ title, description, completed: !!completed });
        const saved = await todo.save();
        return res.status(201).json(saved);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.findAll = async (req, res) => {
    try {
        // optional query: ?completed=true
        const filter = {};
        if (req.query.completed !== undefined) filter.completed = req.query.completed === 'true';
        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        return res.json(todos);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        return res.json(todo);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.update = async (req, res) => {
    try {
        if (!Object.keys(req.body).length) return res.status(400).json({ message: 'No data provided to update' });

        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        return res.json(todo);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.remove = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        return res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.removeAll = async (req, res) => {
    try {
        await Todo.deleteMany({});
        return res.json({ message: 'All todos deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};