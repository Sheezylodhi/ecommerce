// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
if (!user) return NextResponse.json({ error: "User not found" });

if (!user.password) {
  return NextResponse.json({ error: "Please login with Google" });
}


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // JWT Token create
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Response + Cookie set
    const res = NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

    // Cookie me token save
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 din
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
