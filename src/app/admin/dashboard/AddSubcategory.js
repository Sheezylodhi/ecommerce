"use client";
import { useState } from "react";

export default function AddSubcategory() {
  const [main, setMain] = useState("men");
  const [middle, setMiddle] = useState("");
  const [sub, setSub] = useState("");

  const handle = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    const res = await fetch("/api/admin/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mainCategory: main,
        middleCategory: middle,
        subcategory: sub,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Category added!");
      setMiddle("");
      setSub("");
    } else alert(data.error || "Error");
  };

  return (
    <form onSubmit={handle} className="max-w-md space-y-3">
      <label>Main Category</label>
      <select value={main} onChange={(e) => setMain(e.target.value)} className="border p-2">
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>

      </select>

      <label>Middle Category (e.g. Clothing)</label>
      <input value={middle} onChange={(e) => setMiddle(e.target.value)} className="border p-2 w-full"/>

      <label>Subcategory (e.g. Shirts)</label>
      <input value={sub} onChange={(e) => setSub(e.target.value)} className="border p-2 w-full"/>

      <button className="bg-black text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
