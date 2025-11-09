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
