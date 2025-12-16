"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const [form, setForm] = useState(null);
  const [subs, setSubs] = useState([]);
  const [main, setMain] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/products/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setForm(data);
      setMain(data.mainCategory);
      setSubcategory(data.subcategory);
    }
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (main) {
      const token = localStorage.getItem("adminToken");
      fetch("/api/admin/category", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((c) => c.mainCategory === main);
          setSubs(filtered);
        });
    }
  }, [main]);

  if (!form) return <p>Loading...</p>;

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { color: "", images: [""], sizes: [] }],
    });
  };

  const addSize = (vIndex) => {
    const newVariants = [...form.variants];
    newVariants[vIndex].sizes.push({ size: "", price: "", stock: "" });
    setForm({ ...form, variants: newVariants });
  };

  const addImage = (vIndex) => {
    const newVariants = [...form.variants];
    newVariants[vIndex].images.push("");
    setForm({ ...form, variants: newVariants });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      discountPercent: Number(form.discountPercent),
      variants: form.variants.map((v) => ({
        ...v,
        sizes: v.sizes.map((s) => ({
          ...s,
          price: Number(s.price),
          stock: Number(s.stock),
        })),
      })),
      mainCategory: main,
      subcategory,
    };

    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Product updated!");
      router.push("/admin/products");
    } else {
      alert("❌ " + data.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded max-w-4xl"
    >
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Base Price"
        type="number"
        value={form.basePrice}
        onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Discount %"
        type="number"
        value={form.discountPercent}
        onChange={(e) =>
          setForm({ ...form, discountPercent: e.target.value })
        }
        className="border p-2 w-full"
      />

      <label>Main Category</label>
      <select
        value={main}
        onChange={(e) => setMain(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
      </select>

      <label>Subcategory</label>
      <select
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        className="border p-2 w-full"
      >
        {subs.map((s) => (
          <option key={s._id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Variants */}
      <div>
        <h3 className="font-bold">Color Variants</h3>
        {form.variants.map((v, vIndex) => (
          <div key={vIndex} className="border p-3 mt-2 rounded">
            <input
              placeholder="Color"
              value={v.color}
              onChange={(e) => {
                const newVariants = [...form.variants];
                newVariants[vIndex].color = e.target.value;
                setForm({ ...form, variants: newVariants });
              }}
              className="border p-2 w-full"
            />

            <h4>Images</h4>
            {v.images.map((img, iIndex) => (
              <input
                key={iIndex}
                placeholder="Image URL"
                value={img}
                onChange={(e) => {
                  const newVariants = [...form.variants];
                  newVariants[vIndex].images[iIndex] = e.target.value;
                  setForm({ ...form, variants: newVariants });
                }}
                className="border p-2 w-full mt-1"
              />
            ))}
            <button
              type="button"
              onClick={() => addImage(vIndex)}
              className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
            >
              + Add Image
            </button>

            <h4 className="mt-3">Sizes</h4>
            {v.sizes.map((s, sIndex) => (
              <div key={sIndex} className="flex gap-2 mt-1">
                <input
                  placeholder="Size (e.g. M)"
                  value={s.size}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[vIndex].sizes[sIndex].size = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                  className="border p-2 w-1/3"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={s.stock}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[vIndex].sizes[sIndex].stock = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                  className="border p-2 w-1/3"
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={s.price}
                  onChange={(e) => {
                    const newVariants = [...form.variants];
                    newVariants[vIndex].sizes[sIndex].price = e.target.value;
                    setForm({ ...form, variants: newVariants });
                  }}
                  className="border p-2 w-1/3"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSize(vIndex)}
              className="bg-green-500 text-white px-2 py-1 mt-2 rounded"
            >
              + Add Size
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="bg-purple-600 text-white px-4 py-2 mt-3 rounded"
        >
          + Add Color Variant
        </button>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded mt-4 w-full"
      >
        Save Product
      </button>
    </form>
  );
}
