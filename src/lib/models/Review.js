// models/Review.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    text: String,
    images: [String],       // client review me pics
    reply: { type: String }, // admin reply
  },
  { collection: "reviews", timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
