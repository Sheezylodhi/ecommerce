import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    mainCategory: { type: String, enum: ["men", "women", "boys", "girls"], required: true },
    middleCategory: { type: String, required: true },
    subcategory: { type: String, required: true },
  },
  { timestamps: true }
);

delete mongoose.models.Category;  // ← 🟩 FORCE RESET

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
