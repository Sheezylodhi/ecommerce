import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema({
  size: String,
  stock: Number,
  price: Number,
});

const VariantSchema = new mongoose.Schema({
  color: String,
  images: [String],
  sizes: [SizeSchema],
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    basePrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },

    // ✅ MAIN FIX — Ye pehle schema me tha hi nahi
    mainCategory: { type: String, required: true },
    middleCategory: { type: String, required: true },   // << ADD THIS
    subcategory: { type: String, required: true },

    variants: [VariantSchema],

  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
