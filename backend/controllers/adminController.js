import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Table from '../models/Table.js';
import Area from "../models/Area.js";
import Order from "../models/Order.js"; 
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

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error("LỖI KHI LẤY DANH MỤC:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
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

export const editCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục." });

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;

    const updatedCategory = await category.save();
    res.json({ message: "Cập nhật danh mục thành công.", category: updatedCategory });
  } catch (error) {
    console.error("LỖI KHI SỬA DANH MỤC:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật danh mục.", error: error.message });
  }
};

export const removeCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục để xóa." });
    res.json({ message: "Danh mục đã được xóa thành công.", _id: categoryId });
  } catch (error) {
    console.error("LỖI KHI XÓA DANH MỤC:", error);
    res.status(500).json({ message: "Lỗi server khi xóa danh mục.", error: error.message });
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

export const toggleProductStatus = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

    product.is_active = !product.is_active;
    await product.save();

    res.json({ message: `Sản phẩm đã ${product.is_active ? 'bật' : 'tắt'} trạng thái thành công.`, product });
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT TRẠNG THÁI SẢN PHẨM:", error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái sản phẩm.', error: error.message });
  }
};

export const getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách khu vực", error: error.message });
  }
};

export const createArea = async (req, res) => {
  try {
    const { name, description } = req.body;
    const area = await Area.create({ name, description });
    res.status(201).json({ message: "Tạo khu vực thành công", area });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm khu vực", error: error.message });
  }
};

export const removeArea = async (req, res) => {
  try {
    const { id } = req.params;
    await Table.deleteMany({ area: id }); // Xóa bàn thuộc khu vực
    await Area.findByIdAndDelete(id);
    res.json({ message: "Xóa khu vực và các bàn thuộc khu vực thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa khu vực", error: error.message });
  }
};
// Lấy tất cả bàn kèm khu vực + sản phẩm
export const getTablesWithProducts = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate("area", "name")
      .populate("products"); // products là array ObjectId trong Table
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách bàn", error: error.message });
  }
};

// Tạo bàn mới + thêm sản phẩm cùng lúc
export const createTableWithProducts = async (req, res) => {
  try {
    const { name, areaId, products } = req.body; 
    // products = [{ name, price, description, categoryId }, ...] (có thể rỗng)

    const area = await Area.findById(areaId);
    if (!area) return res.status(404).json({ message: "Không tìm thấy khu vực" });

    // Tạo mã bàn tự động
    const code = `${area.name.slice(0, 1).toUpperCase()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    // Tạo bàn
    const table = await Table.create({
      name,
      area: area._id,
      tableCode: code,
      status: products && products.length > 0 ? "occupied" : "available",
    });

    // Tạo sản phẩm (nếu có)
    let createdProducts = [];
    if (products && products.length > 0) {
      for (const p of products) {
        const prod = await Product.create({
          ...p,
          table: table._id,
          is_active: true,
        });
        createdProducts.push(prod._id);
      }
      table.products = createdProducts;
      await table.save();
    }

    const populatedTable = await Table.findById(table._id)
      .populate("area", "name")
      .populate("products");

    res.status(201).json({ message: "Tạo bàn thành công", table: populatedTable });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo bàn", error: error.message });
  }
};

// Sửa bàn + sản phẩm
export const editTableWithProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, areaId, products } = req.body;

    const table = await Table.findById(id);
    if (!table) return res.status(404).json({ message: "Không tìm thấy bàn" });

    if (name) table.name = name;
    if (areaId) table.area = areaId;

    // Xóa cũ + tạo mới sản phẩm nếu products được gửi
    if (products) {
      await Product.deleteMany({ table: table._id });
      const newProducts = [];
      for (const p of products) {
        const prod = await Product.create({
          ...p,
          table: table._id,
          is_active: true,
        });
        newProducts.push(prod._id);
      }
      table.products = newProducts;
      table.status = newProducts.length > 0 ? "occupied" : "available";
    }

    await table.save();

    const populatedTable = await Table.findById(table._id)
      .populate("area", "name")
      .populate("products");

    res.json({ message: "Cập nhật bàn thành công", table: populatedTable });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật bàn", error: error.message });
  }
};

// Xóa bàn + sản phẩm
export const removeTableWithProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) return res.status(404).json({ message: "Không tìm thấy bàn" });

    await Product.deleteMany({ table: table._id }); // xóa sản phẩm liên quan
    await table.remove();

    res.json({ message: "Xóa bàn và sản phẩm thành công", _id: id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bàn", error: error.message });
  }
};

// Lấy danh sách đơn hàng (tổng quát)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("table", "name tableCode status")
      .populate("products.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Lấy chi tiết 1 đơn
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("table", "name tableCode status")
      .populate("products.product", "name price");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: error.message });
  }
};

// Xóa đơn hàng
export const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Cập nhật bàn nếu bàn đang bị khóa bởi đơn này
    if (order.table) {
      const table = await Table.findById(order.table);
      if (table && String(table.currentOrder) === id) {
        table.status = "available";
        table.currentOrder = null;
        await table.save();
      }
    }

    res.json({ message: "Xóa đơn hàng thành công", _id: id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error: error.message });
  }
};

// Thống kê doanh thu theo ngày
export const getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query; // format: "YYYY-MM-DD"

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // Lấy các đơn trong ngày
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    res.json({
      date,
      totalRevenue,
      totalOrders,
      orders,
    });
  } catch (error) {
    console.error("Lỗi thống kê doanh thu:", error);
    res.status(500).json({ message: "Lỗi server khi thống kê doanh thu", error: error.message });
  }
};
