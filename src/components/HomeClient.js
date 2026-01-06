"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeProducts from "./HomeProducts";
  

const banners = ["/banner1.webp", "/banner2.webp", "/banner3.webp"];

export default function HomeClient({ products }) {
    const { status } = useSession();
  const [currentBanner, setCurrentBanner] = useState(0);
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

    useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true);
    }
  }, [status]);
  /* Banner slider */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((p) => (p + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* Auth popup (only once per visit) */
useEffect(() => {
  if (session === undefined) return; // wait for auth

  const timer = setTimeout(() => {
    if (!session) setShowAuthModal(true);
  }, 1500);

  return () => clearTimeout(timer);
}, [session]);


  return (
    <>
      {/* BANNER */}
      <div className="relative font-serif w-full h-80 sm:h-96 lg:h-[600px] overflow-hidden mt-[55px]">
        {banners.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={img} alt="banner" fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <HomeProducts products={products} />

      {/* AUTH MODAL */}
      {showAuthModal && !session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
  className="bg-white rounded-2xl w-[360px] p-6 relative font-serif
  animate-in zoom-in-95 fade-in duration-300"
>

            {/* CLOSE */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setShowAuthModal(false)}
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <h2 className="text-2xl font-bold text-center mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Login to continue shopping
            </p>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => signIn("google")}
                className="py-2.5 rounded-lg border border-gray-200
                flex items-center justify-center gap-2
                hover:bg-gray-50 transition"
              >
                <Image
                  src="/google.svg"
                  alt="google"
                  width={18}
                  height={18}
                />
                Continue with Google
              </button>

              <button
                onClick={() => router.push("/login")}
                className="py-2.5 rounded-lg bg-black text-white
                hover:bg-gray-900 transition"
              >
                Login with Email
              </button>

              <button
                onClick={() => router.push("/register")}
                className="text-sm text-gray-500 hover:underline mt-2"
              >
                Don’t have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
     
    </>
  );
}
