  "use client";
  import { useEffect, useState } from "react";

  export default function OrdersTab() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setOrders(d.orders || []));
    }, []);

    const markDelivered = async (id) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/orders/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();
      if (data.success) {
        alert("Marked delivered & email sent");
        setOrders(prev => prev.map(o => o._id === id ? {...o, deliveryStatus: "delivered"} : o));
      } else alert(data.error || "Error");
    };

    return (
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o._id} className="border p-3 rounded">
            <p><b>Order:</b> {o.orderNumber}</p>
            <p><b>Email:</b> {o.email}</p>
            <p><b>Total:</b> ${o.totalAmount}</p>
            <p><b>Payment:</b> {o.paymentStatus} | <b>Delivery:</b> {o.deliveryStatus}</p>
            {o.deliveryStatus !== "delivered" && (
              <button onClick={()=>markDelivered(o._id)} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">Mark Delivered</button>
            )}
          </div>
        ))}
      </div>
    );
  }
