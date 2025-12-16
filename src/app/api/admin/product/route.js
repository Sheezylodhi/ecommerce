import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { name, basePrice, mainCategory, middleCategory, subcategory, variants } = body;

    if (!name || !basePrice || !mainCategory || !middleCategory || !subcategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
