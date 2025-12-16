"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SubcategoryPage() {
  const params = useParams();
  const { main, middle, sub } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/product?main=${main}&middle=${middle}&sub=${encodeURIComponent(sub)}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
      setLoading(false);
    };
    fetchProducts();
  }, [main, middle, sub]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (products.length === 0) return <p className="text-center mt-10">No products found for "{sub}"</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product._id} className="border rounded-md p-4 hover:shadow-lg transition">
          <img src={product.variants[0]?.images[0] || "/placeholder.png"} alt={product.name} className="w-full h-48 object-cover mb-3 rounded"/>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.subcategory}</p>
          <p className="mt-1 font-bold">${product.basePrice}</p>
          <Link href={`/${main}/${product.middleCategory.toLowerCase()}/${product.subcategory.toLowerCase()}/${product._id}`} className="mt-2 inline-block text-purple-600 hover:underline">View Product</Link>
        </div>
      ))}
    </div>
  );
}
