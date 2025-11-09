// Khu vực ở trong bàn 
import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("Area", areaSchema);
