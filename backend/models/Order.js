
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      quantity: { type: Number, default: 1 },
      note: String,
      price: Number,
    },
  ],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
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

