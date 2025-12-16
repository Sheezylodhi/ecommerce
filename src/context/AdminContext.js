"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAdmin({ username: payload.username });
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setAdmin({ username: payload.username });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
