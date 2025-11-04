// File: backend/server.js

import express from "express";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js'
import path from 'path';
//import cors from 'cors'; // <-- THÊM DÒNG NÀY VÀO

dotenv.config();

const PORT =  process.env.PORT || 3001;

const app = express();

// Cần tạo __dirname cho ES Modules vì nó không có sẵn
const __dirname = path.resolve();

// 1. MIDDLEWARES (Đặt Lên Đầu)
//app.use(cors()); // <-- Cần thiết cho giao tiếp Frontend/Backend
app.use(express.json()); // <-- Cần thiết để đọc req.body

// 2. PHỤC VỤ FILE TĨNH (Ảnh)
app.use('/images', express.static(path.join(__dirname, '/public/images')));

// 3. ĐỊNH TUYẾN (ROUTES)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 4. KẾT NỐI DATABASE (Có thể đặt trước hoặc sau Middlewares/Routes)
connectDB(); 

// 5. LẮNG NGHE CỔNG
app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
})