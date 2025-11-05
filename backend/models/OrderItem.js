import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },

        name: {
            type: String,
            required: true,
        },

        qty: {
            type: Number,
            required: true,
            default: 1.
        },

        price: {
            type: Number,
            required: true,
            default: 0,
        },

        note: {
            type: String,
        },
    },

    {
        timestamps: true
    }
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;