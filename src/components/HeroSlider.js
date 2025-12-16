"use client";
import { useEffect, useState } from "react";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchSlides() {
      const res = await fetch("/api/slider");
      const data = await res.json();
      setSlides(data);
    }
    fetchSlides();
  }, []);

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[500px] overflow-hidden mt-16">
      {slides.map((slide, index) => (
        <img
          key={slide._id}
          src={`/uploads/${slide.image}`}
          alt={slide.title || "slide"}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}

      {/* Optional arrows */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded"
        onClick={() => setCurrent((current + 1) % slides.length)}
      >
        &#10095;
      </button>
    </div>
  );
}
