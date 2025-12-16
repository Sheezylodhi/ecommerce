import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    // store hashedPassword (recommended). If you insist on plain-text, use 'password' field (not recommended).
    hashedPassword: { type: String, required: true },
  },
  { collection: "admins", timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
