import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models/Review.js";

export async function POST(req) {
  try {
    await connectDB();
    const { reviewId, reply } = await req.json();
    if (!reviewId || !reply) return NextResponse.json({ success: false, error: "Missing data" });

    const review = await Review.findByIdAndUpdate(reviewId, { reply }, { new: true });
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("reply error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
