"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Home,
  PlusCircle,
  Layers,
  ShoppingCart,
  Package,
  Menu,
  X,
  ClipboardList,
  DollarSign,
  Clock,
} from "lucide-react";

import AddSubcategory from "./AddSubcategory";
import AddProduct from "./AddProduct";
import OrdersTab from "./OrdersTab";
import ProductList from "../products/page";
import Reports from "./Reports";
import AdminReviewsPage from "./AdminReviewsPage";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f97316", "#ef4444", "#6366f1"];

function Sidebar({ current, setCurrent, closeSidebar }) {
  const items = [
    { key: "dashboard", label: "Overview", icon: <Home size={18} /> },
    { key: "add-product", label: "Add Product", icon: <PlusCircle size={18} /> },
    { key: "add-subcategory", label: "Add Subcategory", icon: <Layers size={18} /> },
    { key: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { key: "products-list", label: "Products List", icon: <Package size={18} /> },
        { key: "products-Review", label: "Products Review", icon: <Package size={18} /> },
      { key: "reports", label: "Reports", icon: <Clock size={18} /> }, 
  ];

  return (
    <aside className="w-64 bg-white/95 dark:bg-gray-900/95 shadow-lg rounded-lg p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Admin</h2>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setCurrent(item.key);
              closeSidebar?.();
            }}
            className={`flex items-center gap-2 text-left p-2 rounded transition-all ${
              current === item.key
                ? "bg-gray-200 font-semibold dark:bg-gray-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
      <div className="p-2 rounded bg-gray-100 text-gray-700">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboardUpdated() {
  const [current, setCurrent] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        setOrders(ordersData.orders || ordersData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const computed = useMemo(() => {
    const totalOrders = orders.length;
    const earnings = orders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);

    let delivered = 0,
      pending = 0,
      cancelled = 0,
      paid = 0;
    orders.forEach((o) => {
      if (o.deliveryStatus === "delivered") delivered++;
      else if (o.deliveryStatus === "cancelled" || o.paymentStatus === "cancelled") cancelled++;
      else pending++;

      if (o.paymentStatus === "paid") paid++;
    });

    const monthly = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short", year: "numeric" });
      monthly[key] = 0;
    }
    orders.forEach((o) => {
      const d = new Date(o.createdAt || o.updatedAt);
      if (isNaN(d)) return;
      const key = d.toLocaleString("default", { month: "short", year: "numeric" });
      if (monthly[key] !== undefined) monthly[key] += Number(o.totalAmount) || 0;
    });

    const lineData = Object.keys(monthly).map((k) => ({ name: k, revenue: monthly[k] }));
    const pieData = [
      { name: "Delivered", value: delivered },
      { name: "Pending", value: pending },
      { name: "Cancelled", value: cancelled },
    ];

    return { totalOrders, earnings, delivered, pending, cancelled, paid, lineData, pieData };
  }, [orders]);

  return (
    <div className="p-4 pt-16 bg-gray-50 min-h-screen relative">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="bg-white dark:bg-gray-900 w-64 h-full p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <Sidebar current={current} setCurrent={setCurrent} closeSidebar={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar desktop */}
        <div className="hidden md:block col-span-3">
          <Sidebar current={current} setCurrent={setCurrent} />
        </div>

        <main className="col-span-12 md:col-span-9">
          {current === "dashboard" && (
            <>
              <div className="flex items-center justify-between mb-6 hidden md:flex">
                <h1 className="text-3xl font-bold">Dashboard</h1>
              </div>
  
              {/* Overview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Orders" value={computed.totalOrders} icon={<ClipboardList size={20} />} />
                <StatCard title="Earnings" value={`$${computed.earnings.toFixed(2)}`} icon={<DollarSign size={20} />} />
                <StatCard title="Paid Orders" value={computed.paid} icon={<ShoppingCart size={20} />} />
                <StatCard title="Products" value={products.length} icon={<Package size={20} />} />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Revenue (last 6 months)</h3>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <LineChart data={computed.lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Order Status</h3>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie dataKey="value" data={computed.pieData} outerRadius={80} innerRadius={40} label>
                          {computed.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold mb-3">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left border-b">
                      <tr>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2">{o.customerName || "N/A"}</td>
                          <td className="py-2">${o.totalAmount}</td>
                          <td className="py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                o.deliveryStatus === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : o.deliveryStatus === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {o.deliveryStatus || "pending"}
                            </span>
                          </td>
                          <td className="py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Dynamic content with icons */}
          {current === "add-product" && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <PlusCircle size={20} /> Add Product
              </h2>
              <AddProduct />
            </div>
          )}
          {current === "add-subcategory" && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <Layers size={20} /> Add Subcategory
              </h2>
              <AddSubcategory />
            </div>
          )}
          {current === "orders" && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <ShoppingCart size={20} /> Orders
              </h2>
              <OrdersTab />
            </div>
          )}
          {current === "reports" && <Reports products={products} orders={orders} />}

          {current === "products-list" && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <Package size={20} /> Products List
              </h2>
              <ProductList />
            </div>
          )}
           {current === "products-Review" && (
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                <Package size={20} /> Reviews 
              </h2>
              <AdminReviewsPage />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
