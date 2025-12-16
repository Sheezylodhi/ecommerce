// app/api/products/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

/** Escape regex special characters */
function escapeRegex(string = "") {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (
      !body.name ||
      !body.mainCategory ||
      !body.middleCategory ||
      !body.subcategory ||
      !body.variants?.length
    ) {
      return NextResponse.json(
        { error: "❌ Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      mainCategory: String(body.mainCategory).trim(),
      middleCategory: String(body.middleCategory).trim(),
      subcategory: String(body.subcategory).trim(),
    };

    const product = await Product.create(payload);
    return NextResponse.json({ success: true, product });

  } catch (err) {
    console.error("Add Product Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const mainRaw = searchParams.get("main");
    const middleRaw = searchParams.get("middle");
    const subRaw = searchParams.get("sub");

    /** BUILD FILTER */
    const filter = {};

    if (mainRaw) {
      const value = decodeURIComponent(mainRaw);
      filter.mainCategory = {
        $regex: `^${escapeRegex(value)}$`,
        $options: "i",
      };
    }

    if (middleRaw) {
      const value = decodeURIComponent(middleRaw);
      filter.middleCategory = {
        $regex: `^${escapeRegex(value)}$`,
        $options: "i",
      };
    }

    if (subRaw) {
      const value = decodeURIComponent(subRaw);
      filter.subcategory = {
        $regex: `^${escapeRegex(value)}$`,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(products);

  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
