import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

export async function GET(req) {
  await connectDB();
  const products = await Product.find({});
  return new Response(JSON.stringify(products), { status: 200 });
}
