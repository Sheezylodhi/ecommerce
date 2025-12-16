"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm({ productId }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // store uploaded images

  // handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
  };

  const submit = async () => {
    if (!name || !text) return alert("Fill name & review");

    // create formData for images support (optional)
    const formData = { productId, name, rating, text, images };

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert("Thanks! Review submitted");
      setName("");
      setText("");
      setRating(5);
      setImages([]);
      location.reload();
    } else alert(data.error || "Error");
  };

  return (
    <div className="space-y-4 rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300">

      <h3 className="text-xl font-semibold tracking-tight text-gray-800">
        Leave a Review
      </h3>

      <div className="space-y-3">

        {/* Name Input */}
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl p-3 bg-gray-100 focus:bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* ⭐ Stars */}
        <div className="flex gap-1 items-center pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={28}
              onClick={() => setRating(i + 1)}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-125 hover:text-yellow-400 ${
                i < rating
                  ? "text-yellow-500 fill-yellow-500 drop-shadow-lg"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl p-3 h-28 bg-gray-100 focus:bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-gray-800 resize-none"
        />

        {/* Optional Image Upload */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Upload Images (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full bg-gray-100 p-2 rounded-xl"
          />
          {/* Preview selected images */}
          {images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Submit Button */}
      <button
        onClick={submit}
        className="w-full bg-black text-white py-3 rounded-xl font-medium tracking-wide hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-lg"
      >
        Submit Review
      </button>
    </div>
  );
}
