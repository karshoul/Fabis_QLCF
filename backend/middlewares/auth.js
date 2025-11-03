import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware bảo vệ các route
const protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra Token trong Header Authorization
    // Format: 'Bearer TOKEN_CHUOI_JWT'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Giải mã Token
            // jwt.verify(token, JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Tìm User và gán vào req.user
            // Chỉ lấy ID và Role để tiết kiệm tài nguyên
            req.user = await User.findById(decoded.id).select('-password_hash'); 
            
            // 4. Cho phép request đi tiếp
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token không hợp lệ, không được ủy quyền.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không tìm thấy Token, không được ủy quyền.' });
    }
};

export { protect };