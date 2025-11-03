import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Tìm user
    const user = await User.findOne({ email });

    // 2. So sánh mật khẩu và kiểm tra tồn tại
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            // 3. Trả về token cho Frontend
            token: generateToken(user._id, user.role), 
        });
    } else {
        // 4. Báo lỗi nếu sai
        res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ.' });
    }
};

// ... Các hàm đăng ký hoặc tạo Admin/Staff ban đầu sẽ ở đây.