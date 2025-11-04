import express from 'express';
import { protect } from '../middlewares/auth.js'; // Bảo vệ bằng JWT
import { isAdmin } from '../middlewares/role.js'; // Kiểm tra quyền Admin
import { createCategory, createProduct, createStaff, getProducts } from '../controllers/adminController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Route tạo nhân viên mới (chỉ Admin)
// Cần đi qua cả protect (xác thực token) và isAdmin (phân quyền)
router.post('/users', protect, isAdmin, createStaff);

router.post('/categories', protect, isAdmin, createCategory);
//router.get('/categories', protect, isAdmin, getCategories);

router.post(
    '/products', 
    protect, 
    isAdmin, 
    upload.single('image'), // Tên trường file trong form là 'image'
    createProduct
);

// ROUTE MỚI: Dùng cho việc tạo sản phẩm không kèm file (Chỉ nhận JSON)
router.post(
    '/products/no-file', // <-- ENDPOINT MỚI
    protect, 
    isAdmin, 
    createProduct 
    // KHÔNG CÓ MIDDLEWARE MULTER
);

router.get('/products', protect, isAdmin, getProducts);

// ... Thêm routes QL Menu, QL Bàn...

export default router;