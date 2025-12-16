import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models/Review.js";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Admin reply detection
    if (body.reviewId && body.reply) {
      // This is admin reply
      const updated = await Review.findByIdAndUpdate(
        body.reviewId,
        { reply: body.reply },
        { new: true }
      );
      return NextResponse.json({ success: true, review: updated });
    }

    // Normal customer review
    const { productId, name, rating, text, userId, images } = body;
    const review = await Review.create({ productId, name, rating, text, userId, images });
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("review error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    let reviews;
    if (productId) {
      // Frontend: fetch reviews for a specific product
      reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .select("name text rating images reply createdAt"); // ensure images & reply included
    } else {
      // Admin: fetch all reviews
      reviews = await Review.find()
        .populate("productId", "name")
        .sort({ createdAt: -1 })
        .select("name text rating images reply createdAt productId");
    }

    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
