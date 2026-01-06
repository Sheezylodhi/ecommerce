"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { signIn } from "next-auth/react";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        login(data.user, data.token);
        router.push("/");
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
          <p className="text-gray-700 text-center mb-1">Login to your account</p>

          <p className="text-sm text-gray-600 text-center mb-4">
            Dont have an account?{" "}
            <motion.span
              onClick={() => router.push("/signup")}
              className="relative text-black cursor-pointer"
              whileHover="hover"
            >
              Create Account
              <motion.span
                variants={{ hover: { width: "100%" } }}
                initial={{ width: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 -bottom-0.5 h-[1px] bg-black"
              />
            </motion.span>
          </p>

          {/* Forgot password link */}
          <p className="text-sm text-gray-600 text-right mb-4 cursor-pointer hover:underline" 
             onClick={() => router.push("/forgot-password")}>
            Forgot Password?
          </p>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-line relative">
              <label className="block text-xs text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-1 py-2 text-base border-b border-black outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="input-line relative">
              <label className="block text-xs text-gray-600 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-1 py-2 text-base border-b border-black outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex justify-center mb-10 pt-6">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`px-12 py-2.5 text-sm font-medium text-white transition
                  ${loading ? "bg-black shimmer-loading cursor-not-allowed" : "bg-black"}`}
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
            </div>
          </form>
        </motion.div>
        <div className="flex justify-center mb-6">
  <motion.button
    type="button"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => signIn("google", { callbackUrl: "/" })}
    className="px-12 py-2.5 text-sm font-medium text-black border border-black"
  >
    Continue with Google
  </motion.button>
</div>

      </div>
         
      <Footer />
    </div>
  );
}
