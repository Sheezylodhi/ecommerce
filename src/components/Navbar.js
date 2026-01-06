"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // ✅ FIX

export default function Navbar() {
  const router = useRouter();

  const { user, login } = useUser(); // ✅ login bhi liya
  const { cart, setIsCartOpen } = useCart();

  const { data: session, status } = useSession(); // ✅ NextAuth session

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [activeMain, setActiveMain] = useState(null);
  const [activeMiddle, setActiveMiddle] = useState(null);
  const [categories, setCategories] = useState([]);

  // 🔥 GOOGLE LOGIN → USER CONTEXT SYNC (MAIN FIX)
  useEffect(() => {
    if (status === "authenticated" && session?.user && !user) {
      login(
        {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
        null
      );
    }
  }, [status, session]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    if (distance > 80) {
      setMobileNav(false);
      setActiveMain(null);
      setActiveMiddle(null);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const mainCategories = ["men", "women", "boys", "girls"];

  const getMiddle = (main) =>
    [
      ...new Set(
        categories
          .filter((c) => c.mainCategory?.toLowerCase() === main)
          .map((c) => c.middleCategory)
      ),
    ];

  const getSub = (main, middle) =>
    categories.filter(
      (c) =>
        c.mainCategory?.toLowerCase() === main &&
        c.middleCategory === middle
    );

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="fixed top-0 w-full bg-white h-[55px] border-b z-50 flex items-center px-4 md:px-10 font-serif">
        {/* LEFT – DESKTOP ONLY */}
        <div className="hidden md:flex gap-10 text-sm uppercase">
          {mainCategories.map((main) => (
            <div key={main} className="relative group h-full flex items-center">
              <span className="cursor-pointer">{main}</span>

              <div className="absolute left-0 top-full w-screen bg-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 px-10 py-10">
                  {getMiddle(main).map((middle) => (
                    <div key={middle}>
                      <Link
                        href={`/${main}/${middle.toLowerCase()}`}
                        className="font-semibold uppercase"
                      >
                        {middle}
                      </Link>

                      <div className="mt-3 space-y-2">
                        {getSub(main, middle).map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/${main}/${middle.toLowerCase()}/${encodeURIComponent(
                              sub.subcategory
                            )}`}
                            className="block text-sm text-gray-700"
                          >
                            {sub.subcategory}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden cursor-pointer"
          onClick={() => setMobileNav(true)}
        >
          <Menu size={20} />
        </button>

        {/* LOGO */}
        <div className="flex-1 text-center font-bold tracking-widest">
          <Link href="/">MYSHOP</Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex cursor-pointer items-center gap-4">
          {/* BAG ICON */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center pointer-events-none">
                {cart.length}
              </span>
            )}
          </button>

          {/* USER ICON */}
          <div className="relative cursor-pointer">
            <button
              onClick={() => {
                if (!user) router.push("/login");
                else router.push("/profile");
              }}
            >
              <User size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE FULLSCREEN NAV */}
      {mobileNav && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[90]"
            onClick={() => setMobileNav(false)}
          />

          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 bg-black text-white z-[100]"
          >
            <div className="p-6 h-full overflow-y-auto relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-wide">Menu</h2>
                <button
                  onClick={() => {
                    setMobileNav(false);
                    setActiveMain(null);
                    setActiveMiddle(null);
                  }}
                >
                  <X />
                </button>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className={`transition-transform duration-300 ${
                    activeMain
                      ? "-translate-x-full absolute inset-0"
                      : "translate-x-0"
                  }`}
                >
                  {mainCategories.map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveMain(m)}
                      className="w-full flex justify-between items-center py-4 border-b border-white/20 uppercase"
                    >
                      <span>{m}</span>
                      <ChevronRight />
                    </button>
                  ))}
                </div>

                {activeMain && (
                  <div
                    className={`transition-transform duration-300 ${
                      activeMiddle
                        ? "-translate-x-full absolute inset-0"
                        : "translate-x-0"
                    }`}
                  >
                    <button
                      onClick={() => setActiveMain(null)}
                      className="flex items-center gap-2 mb-4 text-sm opacity-80"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>

                    {getMiddle(activeMain).map((mid) => (
                      <button
                        key={mid}
                        onClick={() => setActiveMiddle(mid)}
                        className="w-full flex justify-between items-center py-4 border-b border-white/20 uppercase"
                      >
                        <span>{mid}</span>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                )}

                {activeMain && activeMiddle && (
                  <div className="transition-transform duration-300 translate-x-0">
                    <button
                      onClick={() => setActiveMiddle(null)}
                      className="flex items-center gap-2 mb-4 text-sm opacity-80"
                    >
                      <ChevronLeft size={18} /> Back
                    </button>

                    {getSub(activeMain, activeMiddle).map((sub) => (
                      <Link
                        key={sub._id}
                        href={`/${activeMain}/${activeMiddle.toLowerCase()}/${encodeURIComponent(
                          sub.subcategory
                        )}`}
                        onClick={() => setMobileNav(false)}
                        className="block py-4 border-b border-white/20"
                      >
                        {sub.subcategory}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
