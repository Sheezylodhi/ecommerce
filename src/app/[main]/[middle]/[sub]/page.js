"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function SubCategoryPage() {
  const params = useParams();
  const main = params.main;
  const middle = params.middle;
  const sub = params.sub;

  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting & temp filters
  const [sortOption, setSortOption] = useState("newest");
  const [tempPrice, setTempPrice] = useState("all");
  const [tempColor, setTempColor] = useState("all");
  const [tempSize, setTempSize] = useState("all");

  // Applied filters
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [filterSize, setFilterSize] = useState("all");

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = `/api/products?main=${encodeURIComponent(main)}&middle=${encodeURIComponent(middle)}&sub=${encodeURIComponent(sub)}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.error("Products API error:", res.status);
          setProducts([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    if (main && middle && sub) fetchProducts();
    else {
      setProducts([]);
      setLoading(false);
    }
  }, [main, middle, sub]);

  // Apply filters + sorting
  useEffect(() => {
    let temp = Array.isArray(products) ? [...products] : [];

    if (filterPrice !== "all") {
      temp = temp.filter((p) => {
        const price = p.variants?.[0]?.sizes?.[0]?.price ?? p.basePrice ?? 0;
        if (filterPrice === "0-50") return price <= 50;
        if (filterPrice === "51-100") return price > 50 && price <= 100;
        if (filterPrice === "101-200") return price > 100 && price <= 200;
        if (filterPrice === "200+") return price > 200;
        return true;
      });
    }

    if (filterColor !== "all") {
      temp = temp.filter((p) =>
        p.variants?.some((v) => v.color?.toLowerCase() === filterColor.toLowerCase())
      );
    }

    if (filterSize !== "all") {
      temp = temp.filter((p) =>
        p.variants?.some((v) =>
          v.sizes?.some((s) => s.size?.toLowerCase() === filterSize.toLowerCase())
        )
      );
    }

    if (sortOption === "newest") temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortOption === "atoz") temp.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "ztoa") temp.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredProducts(temp);
  }, [products, sortOption, filterPrice, filterColor, filterSize]);

  const applyFilters = () => {
    setFilterPrice(tempPrice);
    setFilterColor(tempColor);
    setFilterSize(tempSize);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-serif">
      <Navbar />

      {/* Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transform transition-transform duration-300 z-50
          w-full sm:w-72
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-lg tracking-wide font-medium mb-4">FILTER BY</h3>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Price</label>
            <select
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-black focus:outline-none"
            >
              <option value="all">All</option>
              <option value="0-50">$0 - $50</option>
              <option value="51-100">$51 - $100</option>
              <option value="101-200">$101 - $200</option>
              <option value="200+">$200+</option>
            </select>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Color</label>
            <select
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-black focus:outline-none"
            >
              <option value="all">All</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </select>
          </div>

          {/* Size */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Size</label>
            <select
              value={tempSize}
              onChange={(e) => setTempSize(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-1 focus:ring-black focus:outline-none"
            >
              <option value="all">All</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="bg-black text-white py-2 rounded w-full mb-3 hover:opacity-95 transition"
          >
            Apply Filters
          </button>

          {/* Close button for both desktop & mobile */}
          <button
            onClick={() => setIsFilterOpen(false)}
            className="border border-gray-300 py-2 rounded w-full hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Overlay for mobile only */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}

      {/* Header */}
      <div className="pt-28 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl tracking-wide font-thin uppercase text-black">
            {main} / {middle} / {sub}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="text-sm uppercase tracking-wide text-black/80">
              Available: <span className="font-medium">{filteredProducts.length}</span>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200 hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} className="text-black" />
              <span className="text-sm uppercase tracking-wide">Filters</span>
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white px-3 py-2 rounded border border-gray-200 text-sm pr-8"
              >
                <option value="newest">Newest</option>
                <option value="atoz">A → Z</option>
                <option value="ztoa">Z → A</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-2 text-black pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className="text-center py-20">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-20">No products found for {main} / {middle} / {sub}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const variant = product.variants?.[0] ?? {};
              const img = variant.images?.[0] ?? product.image ?? "/placeholder.png";
              const price = variant.sizes?.[0]?.price ?? product.basePrice ?? 0;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-md overflow-hidden h-full flex flex-col shadow hover:shadow-lg transition"
                >
                  <Link href={`/product/${product._id}`} className="block relative w-full">
                    <div className="w-full h-80 sm:h-96 md:h-80 lg:h-96 bg-gray-50 relative">
                      <img src={img} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-black/70">new</p>
                        <h3 className="text-sm font-semibold mt-1 leading-tight">{product.name}</h3>
                        <p className="text-xs tracking-wide mt-1">{product.subcategory}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">PKR{price}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          addToCart(
                            product,
                            variant.color ?? null,
                            variant.sizes?.[0]?.size ?? null,
                            variant.sizes?.[0]?.price ?? product.basePrice,
                            img
                          );
                          setIsCartOpen(true);
                        }}
                        className="w-full bg-black text-white py-3 text-sm font-medium hover:opacity-95 transition"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}
