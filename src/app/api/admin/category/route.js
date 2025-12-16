import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const { mainCategory, middleCategory, subcategory } = await req.json();

    if (!mainCategory || !middleCategory || !subcategory)
      return NextResponse.json({ error: "All fields required" });

    const exists = await Category.findOne({ mainCategory, middleCategory, subcategory });
    if (exists)
      return NextResponse.json({ error: "This subcategory already exists" });

    const cat = await Category.create({ mainCategory, middleCategory, subcategory });

    return NextResponse.json({ success: true, category: cat });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ mainCategory: 1, middleCategory: 1, subcategory: 1 });
  return NextResponse.json(cats);
}
