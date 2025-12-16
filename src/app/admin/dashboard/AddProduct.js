"use client";
import { useState, useEffect } from "react";

export default function AddProduct() {
  const [main, setMain] = useState("men");
  const [middles, setMiddles] = useState([]);
  const [middleCategory, setMiddleCategory] = useState("");
  const [subs, setSubs] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    discountPercent: 0,
    variants: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch("/api/admin/category", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const filteredMiddle = data
          .filter(c => c.mainCategory === main)
          .map(c => c.middleCategory)
          .filter((v, i, a) => a.indexOf(v) === i); // unique values
        setMiddles(filteredMiddle);
        setMiddleCategory(filteredMiddle.length ? filteredMiddle[0] : "");

        const filteredSub = data.filter(c => c.mainCategory === main && c.middleCategory === filteredMiddle[0]);
        setSubs(filteredSub);
        setSubcategory(filteredSub.length ? filteredSub[0].subcategory : "");
      })
      .catch(err => console.error(err));
  }, [main]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch("/api/admin/category", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const filteredSub = data.filter(c => c.mainCategory === main && c.middleCategory === middleCategory);
        setSubs(filteredSub);
        setSubcategory(filteredSub.length ? filteredSub[0].subcategory : "");
      })
      .catch(err => console.error(err));
  }, [middleCategory]);

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { color: "", images: [], sizes: [] }]
    });
  };

  const addSize = (vIndex) => {
    const newVariants = [...form.variants];
    newVariants[vIndex].sizes.push({ size: "", price: "", stock: "" });
    setForm({ ...form, variants: newVariants });
  };

  const addImage = (vIndex, file) => {
    const newVariants = [...form.variants];
    const reader = new FileReader();
    reader.onloadend = () => {
      newVariants[vIndex].images.push(reader.result);
      setForm({ ...form, variants: newVariants });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      discountPercent: Number(form.discountPercent),
      variants: form.variants.map(v => ({
        ...v,
        sizes: v.sizes.map(s => ({
          ...s,
          price: Number(s.price),
          stock: Number(s.stock)
        }))
      })),
      mainCategory: main,
      middleCategory,
      subcategory,
    };

    const res = await fetch("/api/admin/product", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Product saved successfully!");
      setForm({ name: "", description: "", basePrice: "", discountPercent: 0, variants: [] });
    } else alert(data.error || "❌ Error saving product");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-4xl">
      <input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 w-full"/>
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 w-full"/>
      <input placeholder="Base Price" type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} className="border p-2 w-full"/>
      <input placeholder="Discount %" type="number" value={form.discountPercent} onChange={e => setForm({...form, discountPercent: e.target.value})} className="border p-2 w-full"/>

      <label>Main Category</label>
      <select value={main} onChange={e => setMain(e.target.value)} className="border p-2 w-full">
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>

      </select>

      <label>Middle Category</label>
      <select value={middleCategory} onChange={e => setMiddleCategory(e.target.value)} className="border p-2 w-full">
        {middles.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <label>Subcategory</label>
      <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="border p-2 w-full">
        {subs.map(s => <option key={s._id} value={s.subcategory}>{s.subcategory}</option>)}
      </select>

      {/* Variants */}
      <div>
        <h3 className="font-bold">Color Variants</h3>
        {form.variants.map((v, vIndex) => (
          <div key={vIndex} className="border p-3 mt-2 rounded">
            <input placeholder="Color" value={v.color} onChange={e => {
              const newVariants = [...form.variants];
              newVariants[vIndex].color = e.target.value;
              setForm({...form, variants: newVariants});
            }} className="border p-2 w-full"/>

            <h4>Images</h4>
            {v.images.map((img, iIndex) => (
              <img key={iIndex} src={img} className="h-24 w-24 object-cover mt-2 border"/>
            ))}
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files[0]) addImage(vIndex, e.target.files[0]);
              }}
              className="border p-2 mt-2"
            />

            <h4 className="mt-3">Sizes</h4>
            {v.sizes.map((s, sIndex) => (
              <div key={sIndex} className="flex gap-2 mt-1">
                <input placeholder="Size (e.g. M)" value={s.size} onChange={e => {
                  const newVariants = [...form.variants];
                  newVariants[vIndex].sizes[sIndex].size = e.target.value;
                  setForm({...form, variants: newVariants});
                }} className="border p-2 w-1/3"/>
                <input placeholder="Stock" type="number" value={s.stock} onChange={e => {
                  const newVariants = [...form.variants];
                  newVariants[vIndex].sizes[sIndex].stock = e.target.value;
                  setForm({...form, variants: newVariants});
                }} className="border p-2 w-1/3"/>
                <input placeholder="Price" type="number" value={s.price} onChange={e => {
                  const newVariants = [...form.variants];
                  newVariants[vIndex].sizes[sIndex].price = e.target.value;
                  setForm({...form, variants: newVariants});
                }} className="border p-2 w-1/3"/>
              </div>
            ))}
            <button type="button" onClick={() => addSize(vIndex)} className="bg-green-500 text-white px-2 py-1 mt-2 rounded">+ Add Size</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="bg-purple-600 text-white px-4 py-2 mt-3 rounded">+ Add Color Variant</button>
      </div>

      <button type="submit" className="bg-black text-white px-4 py-2 rounded mt-4 w-full">Save Product</button>
    </form>
  );
}
