"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Product deleted");
      setProducts(products.filter((p) => p._id !== id));
    } else {
      alert("❌ " + data.error);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Product List</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p._id} className="border">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.mainCategory} / {p.subcategory}</td>
              <td className="p-2 border">${p.basePrice}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => router.push(`/admin/products/edit/${p._id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
