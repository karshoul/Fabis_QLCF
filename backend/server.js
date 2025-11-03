import express from "express";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js'

dotenv.config();

const PORT =  process.env.PORT || 3001;

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
})