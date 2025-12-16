"use client";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const { cart, removeFromCart, increaseQty, decreaseQty, isCartOpen, closeCart, total } =
    useCart();
  const router = useRouter();

  return (
    <>
      {/* DARK OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* CART SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white/90 backdrop-blur-xl shadow-2xl transition-all duration-300 z-50 border-l border-gray-200 
      ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-200/70">
          <h2 className="text-xl font-semibold tracking-wide text-gray-900">
            CART <span className="text-gray-500 text-sm">({cart.length})</span>
          </h2>
          <button
            onClick={closeCart}
            className="p-3 hover:bg-gray-100 rounded-full transition"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="px-6 py-5 overflow-y-auto h-[64%] space-y-7 custom-scrollbar">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}-${idx}`}
                className="border-b border-gray-200/70 pb-6"
              >
                <div className="flex gap-5">
                  {/* IMAGE */}
                  <div className="w-28 h-28 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={item.image}
                      alt="product"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 tracking-wide text-sm uppercase leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>

                    <p className="text-xs text-gray-500">
                      Color: <span className="font-medium">{item.color}</span>
                    </p>

                    <p className="text-base font-semibold mt-2 text-gray-900">
                      PKR {item.price.toLocaleString()}
                    </p>

                    {/* Quantity Box */}
                    <div className="flex items-center border mt-3 w-32 justify-between px-3 py-2 rounded-lg bg-white shadow-sm">
                      <button
                        onClick={() =>
                          decreaseQty(item.productId, item.color, item.size)
                        }
                        className="hover:scale-110 transition"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.productId, item.color, item.size)
                        }
                        className="hover:scale-110 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.color, item.size)
                      }
                      className="text-xs text-gray-600 hover:underline mt-3 tracking-wide"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center mt-20 text-lg font-medium">
              Your cart is empty.
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-7 py-5 border-t border-gray-200/80 bg-white/70 backdrop-blur-xl">
          {/* SUBTOTAL */}
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold tracking-wide text-gray-600">
              SUBTOTAL
            </span>
            <span className="text-lg font-bold text-gray-900">
              PKR {total.toLocaleString()}
            </span>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            className="w-full bg-black text-white py-3 rounded-lg shadow-md font-semibold tracking-wide hover:scale-[1.02] hover:bg-gray-900 transition"
            onClick={() => {
              closeCart();
              router.push("/checkout");
            }}
          >
            CHECK OUT
          </button>

          {/* VIEW CART BUTTON */}
          <button
            className="w-full mt-3 border border-gray-900 py-3 rounded-lg font-semibold tracking-wide hover:bg-black hover:text-white transition"
            onClick={() => {
              closeCart();
              router.push("/cart");
            }}
          >
            VIEW CART
          </button>

          <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center">
            Shipping, taxes, and discount code are calculated at checkout.
          </p>
        </div>
      </div>
    </>
  );
}
