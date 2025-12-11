const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


const DEMO_USER = {
  id: '123',
  username: 'test',
  password: '123456'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check đơn giản
  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    userId: DEMO_USER.id,
    username: DEMO_USER.username,
    hello: 'test'
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  return res.json({ token });
});

module.exports = router;
