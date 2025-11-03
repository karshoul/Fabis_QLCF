// Middleware này không cần import gì vì nó hoạt động dựa trên req.user
// được gán bởi middleware 'protect' (auth.js) trước đó.

/**
 * @desc Middleware kiểm tra người dùng có phải là Admin (Chủ quán) hay không.
 * @return 403 Forbidden nếu không phải Admin.
 */
const isAdmin = (req, res, next) => {
    // Kiểm tra req.user tồn tại và role là 'Admin'
    if (req.user && req.user.role === 'Admin') {
        next(); // Cho phép đi tiếp đến Controller
    } else {
        // Trả về lỗi 403 - Cấm (Forbidden)
        res.status(403).json({ 
            message: 'Truy cập bị từ chối. Yêu cầu quyền Quản trị viên (Admin).' 
        });
    }
};

/**
 * @desc Middleware kiểm tra người dùng có phải là Nhân viên (Staff) hay không.
 * Bao gồm cả Admin vì Admin cũng có quyền thực hiện các tác vụ của Staff.
 * @return 403 Forbidden nếu không phải Staff/Admin.
 */
const isStaff = (req, res, next) => {
    // Kiểm tra role là 'Staff' HOẶC 'Admin'
    if (req.user && (req.user.role === 'Staff' || req.user.role === 'Admin')) {
        next(); // Cho phép đi tiếp
    } else {
        // Trả về lỗi 403 - Cấm (Forbidden)
        res.status(403).json({ 
            message: 'Truy cập bị từ chối. Yêu cầu quyền Nhân viên Bán hàng.' 
        });
    }
};

// Sử dụng Named Export để export các hàm
export { 
    isAdmin, 
    isStaff 
};