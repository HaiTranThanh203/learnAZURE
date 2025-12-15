const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('qs'); // Thư viện để format dữ liệu gửi đi

// API nhận Code từ Frontend gửi về và đổi lấy Token
router.post('/login-mindx', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: "Thiếu Authorization Code" });
    }

    try {
        console.log("1. Đang gửi Code sang MindX để đổi Token...");
        
        // Gọi sang MindX Server
        const tokenResponse = await axios.post(
            process.env.OAUTH_TOKEN_URL,
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                redirect_uri: process.env.OAUTH_CALLBACK_URL, // Phải khớp với .env
                code: code
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const { access_token } = tokenResponse.data;
        console.log("2. Đã nhận Access Token:", access_token.substring(0, 10) + "...");

        // Lấy thông tin User
        const userInfoResponse = await axios.get(process.env.OAUTH_USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userData = userInfoResponse.data;
        console.log("3. User Info:", userData.email);

        // Tạo Token riêng cho hệ thống của bạn (JWT)
        const myAppToken = jwt.sign(
            { 
                sub: userData.sub, 
                email: userData.email, 
                username: userData.preferred_username 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Trả về cho Frontend
        return res.json({
            token: myAppToken,
            user: userData
        });

    } catch (error) {
        console.error("Lỗi SSO:", error.response?.data || error.message);
        return res.status(500).json({ message: "Lỗi xác thực với MindX" });
    }
});

module.exports = router;