"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrder(data.order));
  }, [id, router]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-96 h-40 bg-gray-200 animate-pulse rounded-xl shadow-lg" />
      </div>
    );
  }

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen font-serif bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-12">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={18} />
          Account Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.5fr] gap-16">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-1">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mb-6">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <table className="w-full text-sm table-auto">
              <thead className="text-gray-500 uppercase text-xs">
                <tr>
                  <th className="text-left pb-2">Product</th>
                  <th className="text-center pb-2">Price</th>
                  <th className="text-center pb-2">Qty</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {order.items.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="text-center">Rs.{item.price}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right font-semibold">Rs.{item.price * item.quantity}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end text-lg font-semibold text-gray-700">
              Total: Rs.{order.totalAmount}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Billing Address */}
            <div className=" p-6 ">
              <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
              <p className={`mb-2 inline-block px-2 py-1 rounded-full font-medium ${statusColor(order.paymentStatus)}`}>
                Payment Status: {order.paymentStatus}
              </p>
              <address className="not-italic leading-6 text-gray-700 mt-2">
                {order.customerName}<br />
                {order.address}<br />
                {order.city}<br />
                {order.country}
              </address>
            </div>

            {/* Shipping Address */}
            <div className=" p-6 ">
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <p className={`mb-2 inline-block px-2 py-1 rounded-full font-medium ${statusColor(order.deliveryStatus)}`}>
                Fulfillment Status: {order.deliveryStatus || "Pending"}
              </p>
              <address className="not-italic leading-6 text-gray-700 mt-2">
                {order.customerName}<br />
                {order.address}<br />
                {order.city}<br />
                {order.country}
              </address>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
