import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
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

export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Danh mục đã tồn tại.' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json({ 
            message: 'Tạo danh mục thành công.', 
            category 
        });
    } catch (error) {
        console.error("LỖI CHI TIẾT KHI TẠO DANH MỤC:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo danh mục.' });
    }
};

export const createProduct = async (req, res) => {
    // Dữ liệu từ body: name, price, category
    const { name, price, description, categoryId } = req.body;
    
    // Đường dẫn ảnh từ Multer (req.file)
    const image_url = req.file ? `/images/${req.file.filename}` : '/images/default.jpg';
    
    // Lưu ý: Multer chỉ xử lý file, các trường text khác cần được đọc từ req.body

    try {
        const product = await Product.create({
            name,
            price,
            description,
            category: categoryId, // Lưu ID của Category
            image_url,
            is_active: true
        });

        res.status(201).json({ 
            message: 'Tạo sản phẩm thành công.', 
            product 
        });
    } catch (error) {
        // Lỗi thường gặp: categoryId không hợp lệ
        res.status(500).json({ 
            message: 'Lỗi server khi tạo sản phẩm.',
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    // Sử dụng populate để lấy tên Category thay vì chỉ ID
    const products = await Product.find({}).populate('category', 'name'); 
    res.json(products);
};
