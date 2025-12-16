import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order.js";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("admin orders error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
