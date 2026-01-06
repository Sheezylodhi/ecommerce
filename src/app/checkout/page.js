"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { data: session } = useSession(); // ✅ NextAuth session
  const [token, setToken] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    billingAddress: "",
    billingCity: "",
    billingCountry: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [codSameAddress, setCodSameAddress] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for localStorage token (normal login)
    const localToken = localStorage.getItem("token");
    if (localToken) setToken(localToken);

    // If NextAuth session exists (Google login)
    if (session?.user?.email && !localToken) {
      // You can request a JWT from your API if needed
      setToken(session.user.id); // Example: Using user.id as token
      setForm((prev) => ({
        ...prev,
        name: session.user.name,
        email: session.user.email,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          total,
          token,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
          billingAddress: codSameAddress ? form.address : form.billingAddress,
          billingCity: codSameAddress ? form.city : form.billingCity,
          billingCountry: codSameAddress ? form.country : form.billingCountry,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else if (paymentMethod === "card") {
        clearCart();
        window.location.href = data.url;
      } else {
        clearCart();
        window.location.href = `/success?orderId=${data.orderId}&cod=1`;
        alert("Order placed successfully! Cash on Delivery selected.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed, see console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-md font-serif px-6 py-6 flex items-center justify-between h-24">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">My Shop</h1>
        </div>
        <div className="flex items-center justify-end flex-1 relative">
          <Link href="/cart" className="mr-8">
            <ShoppingCart className="w-7 h-7 cursor-pointer" />
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 lg:p-8 font-serif">
        <h1 className="text-3xl font-bold mb-10 text-left">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT FORM */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <h2 className="font-semibold text-lg mb-2">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {!token && <Link href="/login" className="text-indigo-600 hover:underline ml-4">Sign In</Link>}
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Shipping Details</h2>
              {["name","phone","address","city","country"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-3 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* PAYMENT */}
            <div className="mt-6 space-y-2">
              <h2 className="font-semibold text-lg">Payment Method</h2>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-indigo-600"/>
                Pay with Card
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-indigo-600"/>
                Cash on Delivery
              </label>

              {paymentMethod === "cod" && (
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={codSameAddress} onChange={() => setCodSameAddress(true)} className="accent-indigo-600"/>
                    Use same shipping address
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={!codSameAddress} onChange={() => setCodSameAddress(false)} className="accent-indigo-600"/>
                    Use different billing address
                  </label>
                  {!codSameAddress && (
                    <div className="space-y-2 mt-2">
                      {["billingAddress","billingCity","billingCountry"].map((field) => (
                        <input
                          key={field}
                          name={field}
                          value={form[field]}
                          placeholder={field.replace("billing","Billing ")}
                          className="w-full p-3 rounded-lg bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onChange={handleChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : paymentMethod === "card" ? "Pay with Stripe" : "Place Order (COD)"}
              </button>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="w-full lg:w-1/2 bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item._id} className="relative flex items-center gap-4 p-4 rounded-lg bg-white shadow hover:shadow-lg transition">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover rounded"/>
                      <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-tl-lg">{item.quantity}×</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Price: PKR{item.price}</p>
                      <p className="text-gray-700 font-semibold mt-1">Subtotal: PKR{item.price * item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-gray-500">Your cart is empty.</p>)}

            <div className="border-t pt-4 space-y-2">
              <p className="text-gray-700 font-medium">
                Shipping: {paymentMethod==="card"?"Free":form.city?.toLowerCase()==="karachi"?"200":"500"} PKR
              </p>
              <p className="text-xl font-bold">
                Total: PKR{cart.reduce((sum, item)=>sum+item.price*item.quantity,0) + (paymentMethod==="card"?0:form.city?.toLowerCase()==="karachi"?200:500)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
