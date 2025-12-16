import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
