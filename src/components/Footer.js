"use client";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white font-serif py-12 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        
        {/* Brand Section */}
        <div>
          <h3 className="font-bold text-2xl mb-4">MyShop</h3>
          <p className="leading-relaxed">
            Your go-to destination for quality fashion and accessories. Discover stylish outfits for every occasion and express your personal style with confidence.
          </p>
        </div>

        {/* About Section */}
        <div>
          <h3 className="font-bold text-xl mb-4">About</h3>
          <p className="leading-relaxed">
            MyShop is dedicated to bringing you the latest trends in fashion, carefully curated for men, women, and kids. Our mission is to provide high-quality products while making shopping simple and enjoyable.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-bold text-xl mb-4">Contact Us</h3>
          <p>📧 Email: muhammadshahzaiblodhi@gmail.com</p>
          <p>📞 Phone: +92 305 3062245</p>
        </div>

        {/* Social Section */}
        <div>
          <h3 className="font-bold text-xl mb-4">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-gray-400 transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <Twitter size={24} />
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <p className="text-center mt-8 text-white">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </p>
    </footer>
  );
}
