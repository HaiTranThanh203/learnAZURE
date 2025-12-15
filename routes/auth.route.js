const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");
const https = require("https");

// Biến kiểm soát chế độ Mock
const MOCK_AUTH_ENABLED = process.env.MOCK_AUTH_ENABLED === "true";

// Cấu hình HTTPS Agent (Giữ lại để đảm bảo tính toàn vẹn code gốc, nhưng sẽ bị bỏ qua khi Mock)
const httpsAgent = new https.Agent({
  minVersion: "TLSv1.2",
});

router.post("/login-mindx", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Thiếu Authorization Code" });
  }

  // ==========================================================
  // !!! BẮT ĐẦU LOGIC MOCK AUTHENTICATION ĐỂ KHẮC PHỤC LỖI EPROTO !!!
  // ==========================================================
  if (MOCK_AUTH_ENABLED) {
    console.log("--- MOCK AUTH BẬT: Bỏ qua gọi MindX, tạo Token giả ---");

    // 1. Dữ liệu User giả lập
    const mockUser = {
      sub: "mock_user_id_" + code.substring(0, 5), // Tạo ID giả dựa trên code
      email: "hai.mock@mindx.edu.vn",
      name: "Hải (Mock User)",
      username: "haitt01",
      role: "student", // Đặt vai trò giả nếu cần
    };

    // 2. Tạo App JWT Token giả (dùng JWT_SECRET thật)
    const myAppToken = jwt.sign(mockUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    // 3. Trả về token và user info giả
    return res.json({
      token: myAppToken,
      user: mockUser,
    });
  }
  // ==========================================================
  // !!! KẾT THÚC LOGIC MOCK AUTHENTICATION !!!
  // ==========================================================

  try {
    // Khối code này sẽ chỉ chạy khi MOCK_AUTH_ENABLED là 'false'
    console.log("1. Đang gửi Code sang MindX để đổi Token...");

    const tokenResponse = await axios.post(
      process.env.OAUTH_TOKEN_URL,
      qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.OAUTH_CALLBACK_URL,
        code,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        httpsAgent,
      }
    );

    const { access_token } = tokenResponse.data;
    console.log("2. Đã nhận Access Token");

    const userInfoResponse = await axios.get(process.env.OAUTH_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
      httpsAgent,
    });

    const userData = userInfoResponse.data;

    const myAppToken = jwt.sign(
      {
        sub: userData.sub,
        email: userData.email,
        username: userData.preferred_username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      token: myAppToken,
      user: userData,
    });
  } catch (error) {
    // Nếu có lỗi xảy ra (kể cả EPROTO khi MOCK_ENABLED là false)
    console.error(
      "Lỗi SSO (Thử gọi MindX):",
      error.response?.data || error.message
    );
    return res.status(400).json({
      message: "SSO Login failed due to network or authentication error.",
    });
  }
});

module.exports = router;
