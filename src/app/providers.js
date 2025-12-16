"use client";

import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AdminProvider } from "@/context/AdminContext";

export default function Providers({ children }) {
  return (
    <UserProvider>
      <CartProvider>
        <AdminProvider>{children}</AdminProvider>
      </CartProvider>
    </UserProvider>
  );
}
