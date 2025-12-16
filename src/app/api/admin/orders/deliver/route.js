import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const { orderId } = await req.json();
    const order = await Order.findByIdAndUpdate(orderId, { deliveryStatus: "delivered" }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // send review-request email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Your order ${order.orderNumber} was delivered — please review`,
      html: `
        <h3>Thanks for your purchase!</h3>
        <p>Your order <b>${order.orderNumber}</b> has been marked as <b>delivered</b>.</p>
        <p>Please consider leaving a review for the products you purchased.</p>
        <p><a href="${process.env.NEXT_PUBLIC_URL}/orders/${order._id}">View order & leave review</a></p>
      `
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("deliver error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
