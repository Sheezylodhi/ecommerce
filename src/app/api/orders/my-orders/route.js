  import { NextResponse } from "next/server";
  import { connectDB } from "@/lib/db";
  import { Order } from "@/lib/models/Order";
  import jwt from "jsonwebtoken";

  export async function GET(req) {
    try {
      await connectDB();
      const authHeader = req.headers.get("authorization");
      if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    } catch (err) {
      console.error("My Orders Error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
