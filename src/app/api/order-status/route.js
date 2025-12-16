// src/app/api/order-status/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id") || searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // If session_id provided, fetch session and payment status
    if (sessionId || order.stripeSessionId) {
      const sId = sessionId || order.stripeSessionId;
      const session = await stripe.checkout.sessions.retrieve(sId, { expand: ["payment_intent"] });
      const paymentIntent = session.payment_intent;
      if (paymentIntent && paymentIntent.status === "succeeded") {
        order.status = "paid";
        order.paymentIntentId = paymentIntent.id;
        await order.save();
        return NextResponse.json({ status: "paid", orderId: order._id });
      } else {
        return NextResponse.json({ status: "pending", paymentStatus: paymentIntent?.status || null });
      }
    }

    return NextResponse.json({ status: order.status });
  } catch (err) {
    console.error("order-status error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
