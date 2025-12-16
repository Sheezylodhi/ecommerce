// pages/api/create-payment-intent.js (Next.js "pages" api route example)
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { cart, total, form } = req.body;
    if (!cart || !cart.length) return res.status(400).json({ error: "Cart is empty" });

    // Save pending order first
    const newOrder = await Order.create({
      userId: decoded.id,
      email: form?.email,
      items: cart.map(i => ({
        _id: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount: total,
      orderNumber: "ORD-" + Date.now(),
      paymentStatus: "pending",
      customerName: form?.name,
      address: form?.address,
      city: form?.city,
      country: form?.country,
    });

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(total) * 100), // in cents; make sure total is numeric and currency matches
      currency: process.env.STRIPE_CURRENCY || "usd",
      metadata: {
        orderId: newOrder._id.toString(),
        userId: decoded.id.toString(),
      },
      // optional: receipt_email: form?.email,
    });

    // Store the paymentIntent id on order record
    newOrder.stripePaymentIntentId = paymentIntent.id;
    await newOrder.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
