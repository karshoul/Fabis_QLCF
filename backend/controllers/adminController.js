import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js'; // Cần nếu muốn trả về token sau khi tạo

// @desc    Tạo User mới (Staff hoặc Admin)
// @route   POST /api/admin/users
// @access  Private/Admin
export const createStaff = async (req, res) => {
    const { email, password, full_name, role } = req.body;

    // 1. Kiểm tra dữ liệu bắt buộc
    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // 2. Kiểm tra quyền tạo: Đảm bảo chỉ tạo được role Staff hoặc Admin
    if (!['Admin', 'Staff'].includes(role)) {
        return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    try {
        // 3. Kiểm tra User đã tồn tại
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        // 4. Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 5. Tạo User mới
        const user = await User.create({
            email,
            password_hash,
            full_name,
            role,
        });

        if (user) {
            // Trả về thông tin User vừa tạo (không bao gồm password hash)
            res.status(201).json({
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                message: `Tạo ${role} thành công.`,
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi Server trong quá trình tạo User.' });
    }
};

// ... Các hàm khác như listUsers, updateUser, deleteUser sẽ được thêm vào sau.