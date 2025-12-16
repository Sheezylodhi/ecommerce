"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    // Fetch Orders
    fetch("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []));

    // Fetch Address
  fetch("/api/address/my", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.json())
  .then(data => {
    if (data.addresses && data.addresses.length > 0) {
      setAddress(data.addresses[0]); // 👈 first address
    } else {
      setAddress(null);
    }
  });

  }, [router]);

  return (
    <div className="min-h-screen font-serif bg-white flex flex-col">
      <Navbar />

      {/* HEADER */}
      <div className="text-center mt-24 mb-16">
        <h1 className="text-3xl font-semibold tracking-wide">My Account</h1>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="mt-4 text-sm text-gray-500 hover:text-black transition"
        >
          Log out
        </button>

        <div className="mx-auto mt-4 w-12 h-[2px] bg-black rounded" />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-8 pb-24 grid grid-cols-1 lg:grid-cols-[2.7fr_1.3fr] gap-24">

        {/* LEFT – ORDER HISTORY */}
        <div>
          <h2 className="text-xl font-medium mb-6">Order History</h2>

          <table className="w-full text-sm table-auto">
            <thead className="text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left py-3 font-medium">Order</th>
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Payment</th>
                <th className="text-left py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.length > 0 ? (
                orders.map((o, i) => (
                  <motion.tr
                    key={o._id}
                    onClick={() => router.push(`/orders/${o._id}`)}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-4 font-medium">{o.orderNumber}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className={`capitalize font-medium ${
                      o.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}>{o.paymentStatus}</td>
                    <td className="font-semibold">PKR {o.totalAmount}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-gray-500 text-center">
                    You haven’t placed any orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT – ACCOUNT DETAILS */}
        <div>
          <h2 className="text-xl font-medium mb-6">Account Details</h2>

          {address ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="mb-2 font-medium">{address.fullName}</p>
              <p className="text-sm text-gray-600 leading-6">
                {address.address}<br />
                {address.city}<br />
                {address.country}
              </p>

              <button
                onClick={() => router.push("/profile/address")}
                className="mt-6 px-6 py-3 border border-gray-400 text-sm hover:border-black transition"
              >
                View Addresses (1)
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <button
                onClick={() => router.push("/profile/address")}
                className="px-6 py-3 border border-gray-400 text-sm hover:border-black transition"
              >
                Add Address
              </button>
            </motion.div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
