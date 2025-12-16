import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

export async function GET(req, { params }) {
  await connectDB();
  const product = await Product.findById(params.id);
  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req, { params }) {
  const body = await req.json();
  await connectDB();
  await Product.findByIdAndUpdate(params.id, body);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
