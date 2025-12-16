// pages/api/webhook.js
import Stripe from "stripe";
import { buffer } from "micro";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await connectDB();
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          order.stripePaymentIntentId = paymentIntent.id;
          await order.save();
          console.log("Order marked paid:", orderId);
        }
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await connectDB();
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "failed";
          await order.save();
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
