import multer from 'multer';
import path from 'path';

// Định nghĩa nơi lưu trữ (storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đường dẫn tương đối từ file server.js
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// Định nghĩa bộ lọc file (file filter) để chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
    // Kiểm tra loại file MIME
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Cấu hình Multer chính
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

// Xuất khẩu middleware Multer
export default upload;