"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Image from "next/image";
import { CheckCircle, FileDown, MessageCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      // CLIENT-SIDE URL PARAMS
      const params = new URLSearchParams(window.location.search);
      const session_id = params.get("session_id");
      const orderId = params.get("orderId");
      const isCod = params.get("cod");

      try {
        if (session_id) {
          const res = await fetch("/api/orders/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setOrder(data.order);
        } else if (orderId && isCod) {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setOrder(data.order || data);
        } else {
          throw new Error("Invalid success URL");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setTimeout(() => setShowConfetti(false), 6000);
      }
    }

    loadOrder();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        {error}
      </div>
    );

  const items = order.items || [];
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + 4);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold">
              Thank You for Your Order
            </h1>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Order <b>#{order.orderNumber}</b> confirmed successfully
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700">
            Estimated Delivery by <b>{etaDate.toDateString()}</b>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-lg">Customer Details</h3>
              <p><b>Name:</b> {order.customerName}</p>
              <p><b>Email:</b> {order.email}</p>
              <p><b>Phone:</b> {order.phone}</p>
              <p className="text-sm text-gray-600">
                <b>Address:</b> {order.address}, {order.city}, {order.country}
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-lg">Payment Summary</h3>
              <p>
                <b>Method:</b> {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Stripe)"}
              </p>
              <p><b>Status:</b> {order.paymentStatus}</p>
              <p className="text-xl font-bold mt-2">PKR {order.totalAmount}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-5">Ordered Items</h3>
            <div className="space-y-4">
              {items.map((it, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 border rounded-2xl p-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={
                        it.image?.startsWith("http")
                          ? it.image
                          : it.image
                          ? `${process.env.NEXT_PUBLIC_SITE_URL}${it.image}`
                          : "/placeholder.png"
                      }
                      alt={it.name || "Product Image"}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                    {it.color && <p className="text-xs">Color: {it.color}</p>}
                    {it.size && <p className="text-xs">Size: {it.size}</p>}
                  </div>
                  <div className="font-semibold">PKR {it.price * it.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-100"
            >
              <FileDown size={18} /> Download Invoice
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://wa.me/?text=My order ${order.orderNumber} has been placed successfully`,
                  "_blank"
                )
              }
              className="flex items-center justify-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-100"
            >
              <MessageCircle size={18} /> WhatsApp Confirmation
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl bg-black text-white hover:opacity-90"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
