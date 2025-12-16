import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { cart, total, name, email, address, city, country, token } = await req.json();

    if (!cart || !cart.length) return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Create order in DB
    const newOrder = await Order.create({
      userId: decoded.id,
      email,
      items: cart.map(i => ({ _id: i._id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: total,
      orderNumber: "ORD-" + Date.now(),
      paymentStatus: "pending",
      customerName: name,
      address,
      city,
      country,
    });

    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      metadata: { orderId: newOrder._id.toString(), userId: decoded.id },
    });

    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
