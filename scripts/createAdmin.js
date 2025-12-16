import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "../src/lib/models/Admin.js";

dotenv.config({ path: ".env.local" }); // ya .env

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = "admin";
    const password = "zaib123";

    const hashed = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("Admin already exists:", existing.username);
      process.exit(0);
    }

    const admin = new Admin({ username, hashedPassword: hashed }); // ✅ hashedPassword match with schema
    await admin.save();

    console.log("✅ Admin created:", username, "| Password:", password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
