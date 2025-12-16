"use client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, addToCart }) {
  const router = useRouter();
  const image = product.variants?.[0]?.images?.[0] || "/placeholder.png";
  const price = product.variants?.[0]?.sizes?.[0]?.price || product.basePrice;

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/product/${product._id}`)}
    >
      <img src={image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
      <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">${price}</p>
      <button
        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}
