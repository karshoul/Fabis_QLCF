import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        orderItem: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'OrderItem',
            },
        ],

        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },

        paidAt: {
            type: Date,
        },

        paymentMethod: {
            type: String,
            required: true,
            default: 'Cash',
        },

        isCompleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;