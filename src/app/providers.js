"use client";

import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AdminProvider } from "@/context/AdminContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
     <SessionProvider>    <UserProvider>
      <CartProvider>
        <AdminProvider>{children}</AdminProvider>
      </CartProvider>
    </UserProvider>
    </SessionProvider>

  );
}
