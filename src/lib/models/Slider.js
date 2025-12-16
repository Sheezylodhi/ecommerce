import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema({
  image: { type: String, required: true }, // image path in /uploads
  title: { type: String },
  link: { type: String }, // optional: link if you want
  order: { type: Number, default: 0 }, // for ordering slides
  createdAt: { type: Date, default: Date.now },
});

export const Slider = mongoose.models.Slider || mongoose.model("Slider", SliderSchema);
