import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();  // ✅ DB connect karo
    const cats = await Category.find();
    return NextResponse.json(cats);  // ✅ proper json response
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
