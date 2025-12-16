import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Admin } from "@/lib/models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username });
    if (!admin) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const match = await bcrypt.compare(password, admin.hashedPassword);
    if (!match) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const token = jwt.sign({ username: admin.username, id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
