"use client";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white font-serif py-12 px-8">
<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">

        {/* Brand Section */}
        <div>
          <h3 className="font-bold text-2xl mb-4">Breakout</h3>
          <p className="leading-relaxed">
            Quality fashion for Men, Women, Boys & Girls. Explore the latest trends and find your perfect style. Shop with confidence and express your unique fashion sense.
          </p>
        </div>

        {/* About Section */}
        <div>
          <h3 className="font-bold text-xl mb-4">About</h3>
          <p className="leading-relaxed">
            Breakout is your one-stop online fashion destination. From trendy clothing to stylish accessories, we bring you the latest in fashion for every age and style. Our mission is to help you express your unique personality through quality and style.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-bold text-xl mb-4">Contact Us</h3>
          <p>📧 Email: support@breakout.com</p>
          <p>📞 Phone: +92 300 1234567</p>
          <p>📍 Address: 123 Street, City, Pakistan</p>
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
        &copy; {new Date().getFullYear()} Breakout. All rights reserved.
      </p>
    </footer>
  );
}
