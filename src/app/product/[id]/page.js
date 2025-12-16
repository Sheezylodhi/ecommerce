"use client";
import { useEffect, useState, useRef, use } from "react"; // ✅ add use
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import ReviewForm from "./ReviewForm";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductPage({ params: promiseParams }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const imageRef = useRef(null);

  // ✅ unwrap params
  const params = use(promiseParams);

  useEffect(() => {
    let canceled = false;
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (canceled) return;

        if (!data || data.error) {
          setProduct(null);
          return;
        }

        setProduct(data);

        const firstVariant = data.variants?.[0];
        if (firstVariant) {
          setSelectedColor(firstVariant.color);
          const firstSize = firstVariant.sizes?.[0];
          setSelectedSize(firstSize?.size || null);
          setSelectedPrice(firstSize?.price || data.basePrice);
          setSelectedImage(firstVariant.images?.[0] || data.image || "/placeholder.png");
        } else {
          setSelectedPrice(data.basePrice);
          setSelectedImage(data.image || "/placeholder.png");
        }

        // reviews
        try {
          const reviewsRes = await fetch(`/api/reviews?productId=${params.id}`);
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData?.reviews || []);
        } catch { setReviews([]); }

        // related
        if (data.mainCategory) {
          try {
            const relatedRes = await fetch(
              `/api/products/related?main=${data.mainCategory}&sub=${data.subcategory || ""}&exclude=${data._id}`
            );
            const relatedData = await relatedRes.json();
            setRelated(relatedData || []);
          } catch { setRelated([]); }
        }
      } catch (err) {
        console.error("Load product error:", err);
        setProduct(null);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    fetchProduct();
    return () => { canceled = true; };
  }, [params.id]);

  // sticky logic
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = (qty = 1) => {
    if (!product) return;
    addToCart(product, selectedColor, selectedSize, selectedPrice, selectedImage, qty);
    if (typeof setIsCartOpen === "function") setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart(1);
    setTimeout(() => router.push("/checkout"), 250);
  };

  // rest of your JSX (shimmer, sticky bar, reviews, related, CartSidebar, Footer) stays same



  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 p-6 font-serif max-w-6xl mx-auto">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-2xl w-full h-[420px] shimmer" />
              <div className="flex gap-3">
                <div className="bg-gray-200 h-20 w-20 rounded-lg shimmer" />
                <div className="bg-gray-200 h-20 w-20 rounded-lg shimmer" />
                <div className="bg-gray-200 h-20 w-20 rounded-lg shimmer" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded shimmer" />
              <div className="bg-gray-200 h-6 w-1/3 rounded shimmer" />
              <div className="bg-gray-200 h-32 rounded shimmer" />
              <div className="bg-gray-200 h-10 w-full rounded shimmer" />
              <div className="bg-gray-200 h-10 w-full rounded shimmer" />
            </div>
          </div>
        </div>
        <CartSidebar />
        <Footer />
        <style>{shimmerCSS}</style>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-28 p-6 font-serif max-w-4xl mx-auto">
          <p className="text-center font-serif text-gray-700">Product not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const currentVariant = product.variants?.find((v) => v.color === selectedColor) || product.variants?.[0];
  const currentSizeObj = currentVariant?.sizes?.find((s) => s.size === selectedSize) || currentVariant?.sizes?.[0];
  const isSoldOut = currentVariant?.sizes?.every((s) => s.stock <= 0);

  return (
    <>
      <Navbar />
      <div className="pt-28 font-serif p-6 max-w-6xl mx-auto  space-y-10">
        {/* MAIN PRODUCT AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: media */}
          <div className="flex flex-col gap-4">
            <div ref={imageRef} className="w-full overflow-hidden rounded-2xl bg-white shadow-sm" style={{ minHeight: 420 }}>
              <div className="relative">
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[420px] object-contain transition-transform duration-500 ease-out transform hover:scale-105"
                  style={{ transition: "opacity 300ms ease" }}
                />
                {product.discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                    {product.discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {(currentVariant?.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 transition-transform ${selectedImage === img ? "ring-2 ring-black" : "ring-0"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name}-${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-2xl font-bold">PKR{currentSizeObj?.price ?? product.basePrice}</p>
            </div>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.variants?.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Colors</h3>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                        setSelectedSize(v.sizes?.[0]?.size || null);
                        setSelectedPrice(v.sizes?.[0]?.price || product.basePrice);
                        setSelectedImage(v.images?.[0] || product.image || "/placeholder.png");
                      }}
                      className={`px-4 py-1 rounded-full text-sm transition ${selectedColor === v.color ? "bg-black text-white" : "bg-gray-200"}`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {currentVariant?.sizes?.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Sizes</h3>
                <div className="flex gap-2 flex-wrap">
                  {currentVariant.sizes.map((s) => {
                    const isOutOfStock = s.stock <= 0;
                    return (
                      <button
                        key={s.size}
                        onClick={() => {
                          setSelectedSize(s.size);
                          setSelectedPrice(s.price);
                        }}
                        className={`px-4 py-1 rounded-full text-sm transition flex items-center gap-1 ${
                          selectedSize === s.size
                            ? "bg-black text-white"
                            : isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 text-gray-800"
                        }`}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of stock" : `Stock: ${s.stock}`}
                      >
                        {s.size} {isOutOfStock && "(Out of Stock)"}
                        {!isOutOfStock && <span className="text-xs text-gray-600 ml-1">({s.stock})</span>}
                      </button>
                    );
                  })}
                  {isSoldOut && <p className="text-red-600 font-semibold mt-2">Sold Out</p>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 items-center">
              <button
                onClick={() => handleAddToCart(1)}
                className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
                disabled={isSoldOut}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:shadow transition"
                disabled={isSoldOut}
              >
                Buy Now
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Category: <span className="text-gray-800">{product.mainCategory} / {product.subcategory}</span>
              </p>
              <p className="mt-1">SKU: {product._id}</p>
            </div>
          </div>
        </div>

        {/* Write Review */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>
          <ReviewForm productId={product._id} />
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className="border-b py-3 space-y-2">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-gray-700">{r.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-start">
              {related.map((rp) => (
                <div key={rp._id} className="rounded-xl p-2 hover:shadow-lg transition flex flex-col h-[320px]">
                  <img src={rp.variants?.[0]?.images?.[0] || "/placeholder.png"} className="w-full h-44 object-contain rounded-lg" alt={rp.name} />
                  <h3 className="font-semibold mt-2 line-clamp-1">{rp.name}</h3>
                  <p className="text-gray-600 mt-1">PKR{rp.basePrice}</p>
                  <a href={`/product/${rp._id}`} className="mt-auto bg-black text-white px-4 py-2 rounded-lg text-center">View</a>
                </div>
              ))}
            </div>
          </div>
        )}

        <CartSidebar />
      </div>
      <Footer />
      <style>{shimmerCSS}</style>
    </>
  );
}

const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
.shimmer {
  background: linear-gradient(90deg, #f3f3f3 0%, #ecebeb 50%, #f3f3f3 100%);
  background-size: 1200px 100%;
  animation: shimmer 1.6s infinite linear;
}
`;
