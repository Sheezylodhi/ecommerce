import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectDB();
  const { session_id } = await req.json();

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(
    session.metadata.orderId,
    { paymentStatus: "paid", paymentMethod: "online" },
    { new: true }
  );

  const getImageUrl = (img) => {
    if (!img) return `${process.env.NEXT_PUBLIC_SITE_URL}/placeholder.png`;
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_SITE_URL}${img}`;
  };

  const itemsHtml = order.items.map(
    (i) => `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:12px">
          <img src="${getImageUrl(i.image)}" width="60" height="60" style="border-radius:10px;object-fit:cover" />
        </td>
        <td style="padding:12px;font-weight:500">${i.name}</td>
        <td style="padding:12px;text-align:center">${i.quantity}</td>
        <td style="padding:12px">PKR ${i.price}</td>
      </tr>
    `
  ).join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8" /></head>
  <body style="margin:0;padding:0;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">
            <tr>
              <td style="background:#000;padding:24px;color:#fff;text-align:center">
                <h1 style="margin:0;font-size:24px">Thank You for Your Order 🎉</h1>
                <p style="margin:8px 0 0;color:#ccc">Order #${order.orderNumber}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px">
                <p style="font-size:15px;color:#333">Hi <b>${order.customerName}</b>,</p>
                <p style="font-size:15px;color:#555">We’ve received your order and it’s now being processed. Below are your order details:</p>
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
                      Total: PKR ${order.totalAmount}
                    </td>
                  </tr>
                </table>
                <div style="margin-top:30px;padding:16px;background:#fafafa;border-radius:10px">
                  <p style="margin:0;font-size:14px"><b>Delivery Address</b></p>
                  <p style="margin:6px 0 0;font-size:14px;color:#555">
                    ${order.address}, ${order.city}, ${order.country}<br/>
                    Phone: ${order.phone}
                  </p>
                </div>
                <div style="text-align:center;margin:30px 0">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order._id}" style="background:#000;color:#fff;text-decoration:none;padding:14px 26px;border-radius:30px;font-size:14px;display:inline-block">
                    View Your Order
                  </a>
                </div>
                <p style="font-size:13px;color:#777">If you have any questions, just reply to this email. We’re always happy to help.</p>
                <p style="font-size:13px;color:#777">— Your Store Team</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f1f1f1;padding:16px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} Your Store. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
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
    to: order.email,
    subject: `Order Confirmed • #${order.orderNumber}`,
    html,
  });

  return NextResponse.json({ success: true, order });
}
