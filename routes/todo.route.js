const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const todoController = require('../controllers/todo.controller');
router.post('/', todoController.create);
router.get('/', todoController.findAll);
router.get('/:id', todoController.findOne);
router.put('/:id', todoController.update);
router.delete('/:id', todoController.remove);
module.exports = router;