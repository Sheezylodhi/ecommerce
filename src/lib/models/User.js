// lib/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false, // ✅ GOOGLE USERS
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { collection: "users", timestamps: true }
);

// 🔥 VERY IMPORTANT FIX (DEV MODE)
delete mongoose.models.User;

export const User = mongoose.model("User", UserSchema);
