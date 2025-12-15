// src/middleware/authMiddleware.js (ĐÃ SỬA CHUẨN XÁC)
const jwt = require('jsonwebtoken');
const { JwksClient } = require('jwks-rsa');

// ... (Giữ nguyên cấu hình OIDC và hàm getKey ở trên) ...
const MOCK_ENABLED = process.env.MOCK_AUTH_ENABLED === 'true'; 
// ...

module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // LƯU Ý QUAN TRỌNG:
    // Token mà Frontend gửi lên route /employees là App Token (JWT) do Backend tự tạo ra 
    // sau khi gọi MindX thành công. Token này được ký bằng JWT_SECRET (Khóa đối xứng).

    // === XÁC MINH APP TOKEN BẰNG KHÓA ĐỐI XỨNG ===
    try {
        // Luôn sử dụng JWT_SECRET để xác minh App Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded;
        return next();
    } catch (err) {
        // Nếu xác minh thất bại (sai Secret, hết hạn)
        console.error('App JWT Verification Failed (Invalid Secret or Expired):', err.message);
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }

    /* KHỐI LOGIC OIDC NÀY ĐÃ BỊ LOẠI BỎ vì nó chỉ dùng để xác minh Token do MindX cấp 
    (chứ không phải Token do App của bạn cấp) 
    
    if (!MOCK_ENABLED) { 
        // Logic cũ: sai vì cố dùng OIDC để xác minh App Token 
    } 
    */
};