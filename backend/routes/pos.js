import express from 'express';
import { protect } from '../middlewares/auth.js';
import { isStaff } from '../middlewares/role.js';
import { createOrder } from '../controllers/posController.js'; // Import hàm Controller

const router = express.Router();

// Route POST /api/pos/orders
// Tạo đơn hàng mới. Chỉ Staff và Admin mới có quyền truy cập.
router.route('/orders').post(protect, isStaff, createOrder);

// ... Thêm các routes khác (Thanh toán, Lịch sử đơn hàng...)

export default router;