"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const categories = ["men", "women", "boys", "girls"];

export default function HomeProducts({ products }) {
  const router = useRouter();

  /* Categorize products (same logic as code2) */
  const categorizedProducts = categories.reduce((acc, mainCat) => {
    const list = products.filter(
      (p) => p.mainCategory?.toLowerCase() === mainCat
    );

    const grouped = {};
    for (const p of list) {
      const middle = p.middleCategory?.toLowerCase() || "default";
      const sub = p.subcategory?.toLowerCase() || "others";

      if (!grouped[middle]) grouped[middle] = {};
      if (!grouped[middle][sub]) grouped[middle][sub] = p;
    }

    acc[mainCat] = Object.values(grouped).flatMap((s) =>
      Object.values(s)
    );

    return acc;
  }, {});

  /* Center slider on load */
  useEffect(() => {
    categories.forEach((cat) => {
      const slider = document.getElementById(`slider-${cat}`);
      if (slider) {
        const center =
          (slider.scrollWidth - slider.clientWidth) / 2;
        slider.scrollTo({ left: center, behavior: "smooth" });
      }
    });
  }, [products]);

  const scrollSlider = (id, dir) => {
    document.getElementById(id)?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-6 py-12 font-serif space-y-20">
      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="text-2xl mb-6 text-center uppercase tracking-wide">
            {cat}
          </h2>

          <div className="relative">
            {/* LEFT ARROW */}
            <button
              onClick={() => scrollSlider(`slider-${cat}`, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-white/80 backdrop-blur p-2 rounded-full shadow
              hover:scale-110 transition"
            >
              <ChevronLeft size={22} />
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scrollSlider(`slider-${cat}`, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-white/80 backdrop-blur p-2 rounded-full shadow
              hover:scale-110 transition"
            >
              <ChevronRight size={22} />
            </button>

            {/* PRODUCTS SLIDER */}
            <div
              id={`slider-${cat}`}
              className="flex gap-4 overflow-x-auto scroll-smooth
              px-10 hide-scrollbar"
            >
              {categorizedProducts[cat]?.length > 0 ? (
                categorizedProducts[cat].map((p, index) => {
                  const variant = p.variants?.[0];
                  const imgSrc =
                    variant?.images?.[0] || "/placeholder.jpg";
                  const price =
                    variant?.sizes?.[0]?.price || p.basePrice;

                  const main = p.mainCategory?.toLowerCase();
                  const middle = p.middleCategory?.toLowerCase();
                  const sub = encodeURIComponent(
                    p.subcategory?.toLowerCase()
                  );

                  return (
                    <div
                      key={p._id}
                      style={{
                        animation: `cardDrop 0.6s ease forwards`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                      className="min-w-[220px] max-w-[220px] h-[420px]
                      relative cursor-pointer overflow-hidden
                      border border-gray-100 bg-white
                      opacity-0
                      hover:scale-[1.03]
                      transition-transform duration-300"
                      onClick={() =>
                        router.push(`/${main}/${middle}/${sub}`)
                      }
                    >
                      <Image
                        src={imgSrc}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />

                      {/* PRICE + NAME */}
                      <div
                        className="absolute bottom-2 left-2
                        bg-white/80 backdrop-blur px-2 py-1"
                      >
                        <h3 className="text-sm font-semibold truncate">
                          {p.name}
                        </h3>
                        <p className="text-sm font-semibold">
                          PKR {price}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No products</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
