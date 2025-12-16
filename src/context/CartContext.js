"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size, price, image, qty = 1) => {
    setCart(prev => {
      const exist = prev.find(
        i =>
          i.productId === product._id &&
          i.color === color &&
          i.size === size
      );

      if (exist) {
        return prev.map(i =>
          i === exist ? { ...i, quantity: i.quantity + qty } : i
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price,
          color,
          size,
          image,
          quantity: qty
        }
      ];
    });
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev =>
      prev.filter(
        i =>
          !(i.productId === id && i.color === color && i.size === size)
      )
    );
  };

  const increaseQty = (id, color, size) => {
    setCart(prev =>
      prev.map(i =>
        i.productId === id && i.color === color && i.size === size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decreaseQty = (id, color, size) => {
    setCart(prev =>
      prev.map(i =>
        i.productId === id && i.color === color && i.size === size
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ✅ Add this function
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        total,
        isCartOpen,
        setIsCartOpen,
        openCart,   // ✅ added
        closeCart   // ✅ added
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
