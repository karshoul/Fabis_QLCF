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

export const editProduct = async (req, res) => {
    // Lấy ID sản phẩm từ URL params
    const productId = req.params.id;
    // Lấy các trường cần cập nhật từ request body
    const { name, price, description, categoryId, is_active } = req.body;
    
    // Lấy đường dẫn ảnh nếu có file mới được upload (sử dụng Multer)
    // Nếu req.file tồn tại, dùng ảnh mới; nếu không, giữ nguyên (sẽ không cập nhật trường image_url)
    const new_image_url = req.file ? `/images/${req.file.filename}` : null;
    
    try {
        // Tìm sản phẩm theo ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        // Cập nhật các trường dữ liệu
        // Chỉ cập nhật nếu trường đó được cung cấp trong req.body
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (categoryId !== undefined) product.category = categoryId;
        if (is_active !== undefined) product.is_active = is_active;
        
        // Cập nhật URL ảnh nếu có ảnh mới
        if (new_image_url) {
            product.image_url = new_image_url;
        }

        // Lưu thay đổi vào database
        const updatedProduct = await product.save();

        // Trả về kết quả thành công
        res.json({
            message: 'Cập nhật sản phẩm thành công.',
            product: updatedProduct
        });
        
    } catch (error) {
        console.error("LỖI CHI TIẾT KHI SỬA SẢN PHẨM:", error);
        // Lỗi có thể là do ID không đúng định dạng (CastError) hoặc lỗi server khác
        res.status(500).json({ 
            message: 'Lỗi server khi cập nhật sản phẩm.',
            error: error.message
        });
    }
};

export const removeProduct = async (req, res) => {
    // Lấy ID sản phẩm từ URL params
    const productId = req.params.id;

    try {
        // Tìm và xóa sản phẩm theo ID
        // Note: Sử dụng findByIdAndDelete để vừa tìm vừa xóa
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            // Trường hợp không tìm thấy sản phẩm với ID này
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa.' });
        }

        // Trả về kết quả thành công
        res.json({ message: 'Sản phẩm đã được xóa thành công.', _id: productId });
        
    } catch (error) {
        console.error("LỖI CHI TIẾT KHI XÓA SẢN PHẨM:", error);
        res.status(500).json({ 
            message: 'Lỗi server khi xóa sản phẩm.',
            error: error.message
        });
    }
};