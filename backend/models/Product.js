import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        //Giá bán VND
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: false,
            maxlength: 500,
        },

        //Liên kết Foreign Key đến Schema Category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category', // Tham chiếu đến Model Category
        },

        image_url: {
            type: String,
            require: false,
            default: '/images/default.jpg',
        },
        //Trạng thái sản phẩm
        is_active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

const Product = mongoose.model('Product', productSchema);

export default Product;