import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    return jwt.sign(
        // Payload: Dữ liệu người dùng được mã hóa trong token
        { id, role }, 
        process.env.JWT_SECRET, // KEY bí mật lưu trong .env
        { expiresIn: '30d' } // Hạn sử dụng của token
    );
};

export default generateToken;