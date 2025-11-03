import express from 'express';
import { protect } from '../middlewares/auth.js'; // Bảo vệ bằng JWT
import { isAdmin } from '../middlewares/role.js'; // Kiểm tra quyền Admin
import { createStaff } from '../controllers/adminController.js';

const router = express.Router();

// Route tạo nhân viên mới (chỉ Admin)
// Cần đi qua cả protect (xác thực token) và isAdmin (phân quyền)
router.post('/users', protect, isAdmin, createStaff);
//router.get('/users', protect, isAdmin, listUsers);

// ... Thêm routes QL Menu, QL Bàn...

export default router;