"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-serif flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 pt-24 max-w-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <p className="text-gray-700 text-center mb-1">
            Create your account
          </p>

          {/* Login */}
          <p className="text-sm text-gray-600 text-center mb-8">
            Already have an account?{" "}
            <motion.span
              onClick={() => router.push("/login")}
              className="relative text-black cursor-pointer"
              whileHover="hover"
            >
              Login
              <motion.span
                variants={{ hover: { width: "100%" } }}
                initial={{ width: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 -bottom-0.5 h-[1px] bg-black"
              />
            </motion.span>
          </p>

          {error && (
            <p className="text-red-600 mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-line relative">
              <label className="block text-xs text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-1 py-2 text-base border-b border-black outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="input-line relative">
              <label className="block text-xs text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-1 py-2 text-base border-b border-black outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="input-line relative">
              <label className="block text-xs text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-1 py-2 text-base border-b border-black outline-none"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* Button with loading shimmer */}
            <div className="flex justify-center mb-10 pt-6">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`px-12 py-2.5 text-sm font-medium text-white transition
                  ${loading ? "bg-black shimmer-loading cursor-not-allowed" : "bg-black"}
                `}
              >
                {loading ? "Creating account..." : "Create Account"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
