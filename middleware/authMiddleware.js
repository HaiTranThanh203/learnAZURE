// src/middleware/authMiddleware.js (ĐÃ SỬA)
const jwt = require('jsonwebtoken');
const { JwksClient } = require('jwks-rsa');

// Lấy chế độ chạy hiện tại
const MOCK_ENABLED = process.env.MOCK_AUTH_ENABLED === 'true'; 

// --- CẤU HÌNH OIDC (Chỉ dùng khi MOCK_ENABLED=false) ---
const IDP_URL = 'https://id-dev.mindx.edu.vn';
const JWKS_URI = `${IDP_URL}/auth/realms/MindX/protocol/openid-connect/certs`; 

const client = new JwksClient({
    jwksUri: JWKS_URI,
    cache: true,
    cacheMaxAge: 86400000,
});

function getKey(header, callback) {
    // ... (Hàm này giữ nguyên như trước, chỉ dùng cho chế độ OIDC)
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error('Error fetching signing key:', err.message);
            return callback(err);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}
// --------------------------------------------------------

module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (MOCK_ENABLED) {
        // === CHẾ ĐỘ 1: MOCK AUTH (Tự ký/Tự xác minh) ===
        try {
            // Xác minh token bằng khóa bí mật local
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded;
            return next();
        } catch (err) {
            console.error('MOCK JWT Verification Failed:', err.message);
            return res.status(401).json({ message: 'Invalid or expired mock token' });
        }

    } else {
        // === CHẾ ĐỘ 2: OIDC THẬT (Xác minh bằng JWKS) ===
        // BƯỚC 1: Giải mã token để lấy header
        const decodedHeader = jwt.decode(token, { complete: true });

        if (!decodedHeader) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // BƯỚC 2: Xác minh chữ ký token bằng khóa công khai (dùng hàm getKey)
        jwt.verify(token, getKey, {
            algorithms: ['RS256'],
            audience: process.env.OIDC_CLIENT_ID, 
            issuer: `${IDP_URL}/auth/realms/MindX`,
        }, (err, decoded) => {
            if (err) {
                console.error('OIDC JWT Verification Failed:', err.message);
                return res.status(401).json({ message: 'Invalid or expired OIDC token', error: err.message });
            }
            req.user = decoded; 
            next();
        });
    }
};