// src/routes/auth.route.js (TẠO LẠI ĐỂ MOCK TOKEN)
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user (không cần kết nối DB)
const DEMO_USER = {
  id: 'abc-123',
  username: 'testuser',
};

router.post('/login', (req, res) => {
    // Chỉ cần username để demo tạo token
    const { username } = req.body; 

    if (username !== DEMO_USER.username) {
        return res.status(401).json({ message: 'Mock login failed' });
    }

    const payload = {
        sub: DEMO_USER.id, // 'sub' là trường chuẩn của JWT/OIDC (subject)
        preferred_username: DEMO_USER.username,
        azp: process.env.OIDC_CLIENT_ID || 'mock-client',
        // Thêm các trường chuẩn khác để giống token thật
    };

    // Ký token bằng khóa bí mật local
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({ token });
});

module.exports = router;