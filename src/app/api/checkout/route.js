import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const {
      cart,
      total,
      name,
      email,
      phone,
      address,
      city,
      country,
      billingAddress,
      billingCity,
      billingCountry,
      paymentMethod,
      token,
    } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newOrder = await Order.create({
      userId: decoded.id,
      email,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image || "/placeholder.png"
      })),
      totalAmount: total,
      orderNumber: "ORD-" + Date.now(),
      paymentStatus: paymentMethod === "card" ? "pending" : "paid",
      customerName: name,
      phone,
      address,
      city,
      country,
      billingAddress,
      billingCity,
      billingCountry,
      paymentMethod,
    });

    for (const item of cart) {
      await Product.updateOne(
        { _id: item.productId, "variants.color": item.color, "variants.sizes.size": item.size },
        { $inc: { "variants.$[v].sizes.$[s].stock": -item.quantity } },
        { arrayFilters: [{ "v.color": item.color }, { "s.size": item.size }] }
      );
    }

    // STRIPE PAYMENT
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cart.map((item) => ({
          price_data: {
            currency: "pkr",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
        metadata: { orderId: newOrder._id.toString() },
      });

      newOrder.stripeSessionId = session.id;
      await newOrder.save();

      return NextResponse.json({ url: session.url });
    }

    // COD EMAIL (Professional template)
    if (paymentMethod === "cod") {
      const getImageUrl = (img) => {
        if (!img) return `${process.env.NEXT_PUBLIC_SITE_URL}/placeholder.png`;
        if (img.startsWith("http")) return img;
        return `${process.env.NEXT_PUBLIC_SITE_URL}${img}`;
      };

      const itemsHtml = newOrder.items.map(i => `
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:12px">
            <img src="${getImageUrl(i.image)}" width="60" height="60" style="border-radius:10px;object-fit:cover" />
          </td>
          <td style="padding:12px;font-weight:500">${i.name}</td>
          <td style="padding:12px;text-align:center">${i.quantity}</td>
          <td style="padding:12px">PKR ${i.price}</td>
        </tr>
      `).join("");

      const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8" /></head>
      <body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:30px">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">
              <tr><td style="background:#000;padding:24px;color:#fff;text-align:center">
                <h1 style="margin:0;font-size:24px">Thank You for Your Order 🎉</h1>
                <p style="margin:8px 0 0;color:#ccc">Order #${newOrder.orderNumber}</p>
              </td></tr>

              <tr><td style="padding:24px">
                <p style="font-size:15px;color:#333">Hi <b>${newOrder.customerName}</b>,</p>
                <p style="font-size:15px;color:#555">We’ve received your order and it will be processed shortly. Below are your order details:</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:20px">
                  <tr style="background:#f1f1f1">
                    <th style="padding:12px;text-align:left">Item</th>
                    <th style="padding:12px;text-align:left">Product</th>
                    <th style="padding:12px">Qty</th>
                    <th style="padding:12px;text-align:left">Price</th>
                  </tr>
                  ${itemsHtml}
                </table>

                <table width="100%" style="margin-top:20px">
                  <tr>
                    <td style="text-align:right;font-size:18px;font-weight:bold">
                      Total: PKR ${newOrder.totalAmount}
                    </td>
                  </tr>
                </table>

                <div style="margin-top:30px;padding:16px;background:#fafafa;border-radius:10px">
                  <p style="margin:0;font-size:14px"><b>Delivery Address</b></p>
                  <p style="margin:6px 0 0;font-size:14px;color:#555">
                    ${newOrder.address}, ${newOrder.city}, ${newOrder.country}<br/>
                    Phone: ${newOrder.phone}
                  </p>
                </div>

                <div style="text-align:center;margin:30px 0">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders" style="background:#000;color:#fff;text-decoration:none;padding:14px 26px;border-radius:30px;font-size:14px;display:inline-block">
                    View Your Order
                  </a>
                </div>

                <p style="font-size:13px;color:#777">If you have any questions, just reply to this email. We’re always happy to help.</p>
                <p style="font-size:13px;color:#777">— Your Store Team</p>
              </td></tr>

              <tr><td style="background:#f1f1f1;padding:16px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} Your Store. All rights reserved.
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
      `;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Your Store" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmed • #${newOrder.orderNumber}`,
        html,
      });

      return NextResponse.json({ success: true, orderId: newOrder._id });
    }
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}