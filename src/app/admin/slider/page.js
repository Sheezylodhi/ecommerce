"use client";

import { useState } from "react";

export default function SliderAdminPage() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [msg, setMsg] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMsg("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("order", order);

    const res = await fetch("/api/admin/slider/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setMsg("Image uploaded successfully!");
    } else {
      setMsg("Upload failed.");
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Slider Image</h1>

      <form onSubmit={handleUpload} className="space-y-5">
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 w-full"
          accept="image/*"
        />

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Order Number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded"
        >
          Upload
        </button>

        {msg && <p className="text-green-700 font-semibold">{msg}</p>}
      </form>
    </div>
  );
}
