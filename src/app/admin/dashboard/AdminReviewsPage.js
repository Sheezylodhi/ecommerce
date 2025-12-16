"use client";
import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setReviews([]);
      }
    }
    fetchReviews();
  }, []);

  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]) return alert("Write a reply first");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reply: replyText[reviewId] }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Reply sent!");
        setReviews(
          reviews.map((r) =>
            r._id === reviewId ? { ...r, reply: replyText[reviewId] } : r
          )
        );
        setReplyText({ ...replyText, [reviewId]: "" });
      } else {
        alert(data.error || "Error sending reply");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reply");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>

      {reviews.length === 0 && <p>No reviews found.</p>}

      {reviews.map((r) => (
        <div key={r._id} className="border p-4 rounded-lg shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold">
              {r.name} -{" "}
              <span className="text-gray-500">{r.productId?.name || "Product deleted"}</span>
            </p>
            <p>{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>

          <p>{r.text}</p>

          {r.images?.length > 0 && (
            <div className="flex gap-2">
              {r.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-16 h-16 object-cover rounded"
                  alt="review-img"
                />
              ))}
            </div>
          )}

          {r.reply ? (
            <div className="ml-4 pl-2 border-l-2 border-gray-300 text-gray-700">
              <p>
                <strong>Admin Reply:</strong> {r.reply}
              </p>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="Write a reply..."
                value={replyText[r._id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [r._id]: e.target.value })
                }
                className="px-3 py-2 rounded-lg flex-1 border focus:ring-2 focus:ring-gray-800"
              />
              <button
                onClick={() => handleReply(r._id)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
