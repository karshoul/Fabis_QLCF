import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; // Import Model User
import { connectDB } from './config/db.js'; // Import hàm kết nối DB

// Load biến môi trường
dotenv.config();

// Kết nối DB
connectDB();

const importData = async () => {
    try {
        // 1. Xóa tất cả user hiện có để tránh trùng lặp khi chạy lại
        await User.deleteMany(); 
        console.log('--- Dữ liệu User cũ đã được xóa! ---');

        // 2. Tạo password hash cho Admin
        const password = 'adminpassword'; // Mật khẩu gốc bạn muốn dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo Admin User
        const adminUser = new User({
            full_name: 'System Admin',
            email: 'admin@poscafe.com', // Email Admin mặc định
            password_hash: hashedPassword,
            role: 'Admin', // ĐẶT ROLE LÀ ADMIN
        });

        await adminUser.save();

        console.log('✅ Tạo Admin User thành công!');
        console.log(`Email: admin@poscafe.com | Mật khẩu: ${password}`);
        process.exit(); // Thoát script sau khi thành công

    } catch (error) {
        console.error(`❌ Lỗi khi import dữ liệu: ${error.message}`);
        process.exit(1);
    }
};

// Chạy hàm import data
importData();