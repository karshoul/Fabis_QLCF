import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tableCode: { type: String, unique: true }, // Mã bàn duy nhất, auto-gen
  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true }, // Liên kết khu vực
  status: { type: String, enum: ["available", "occupied"], default: "available" },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null }, // Đơn hàng hiện tại (nếu có)
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Sản phẩm trong bàn
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);
