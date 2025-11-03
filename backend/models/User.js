import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password_hash: { 
            type: String, 
            required: true 
        },
        full_name: { 
            type: String, 
            required: true 
        },
        // Role là cốt lõi cho phân quyền (Admin hoặc Staff)
        role: { 
            type: String, 
            required: true, 
            enum: ['Admin', 'Staff'], 
            default: 'Staff' 
        },
    },
    { timestamps: true }
);

// Phương thức giúp so sánh mật khẩu trong Controller
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);
export default User;