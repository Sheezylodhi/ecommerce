import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const orderId = url.pathname.split("/").pop(); // extract last segment from /api/orders/<orderId>
    const auth = req.headers.get("authorization");
    let decoded = null;

    if (auth) {
      const token = auth.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    let order;
    if (decoded) {
      // logged-in user
      order = await Order.findOne({ _id: orderId, userId: decoded.id });
    } else {
      // COD / guest
      order = await Order.findOne({ _id: orderId, paymentMethod: "cod" });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}
