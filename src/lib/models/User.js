// lib/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { collection: "users", timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
