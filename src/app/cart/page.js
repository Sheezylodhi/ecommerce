"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col font-serif bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 flex-1">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center  py-20 flex flex-col items-center gap-6">
            <img
              src="/empty-cart.svg"
              alt="Empty Cart"
              className="w-40 h-40 object-contain"
            />
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link
              href="/"
              className="text-white bg-black px-6 py-2 rounded hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cart.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}-${idx}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-4 rounded-xl shadow hover:shadow-xl transition"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg"
                  />

                  {/* Product Details */}
                  <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0 flex flex-col w-full">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.size && `Size: ${item.size}`}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() =>
                          decreaseQty(item.productId, item.color, item.size)
                        }
                        className="p-2 border rounded hover:bg-gray-200 transition disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQty(item.productId, item.color, item.size)
                        }
                        className="p-2 border rounded hover:bg-gray-200 transition"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.color, item.size)
                        }
                        className="ml-auto sm:ml-0 text-red-600 hover:text-red-800 flex items-center gap-1 mt-2 sm:mt-0"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>

                    <p className="mt-3 font-semibold text-gray-900 text-lg">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 bg-white p-6 rounded-xl shadow mt-6 lg:mt-0">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Order Summary
              </h2>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  PKR {total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  PKR {total > 0 ? "10" : "0"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 font-semibold">
                <span>Total</span>
                <span>
                  PKR {(total + (total > 0 ? 10 : 0)).toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-black text-white py-3 rounded mt-6 font-semibold hover:scale-[1.02] transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full text-center border border-black py-3 rounded mt-3 font-semibold hover:bg-black hover:text-white transition"
              >
                Continue Shopping
              </Link>

              <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center">
                Shipping, taxes, and discount code are calculated at checkout.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
