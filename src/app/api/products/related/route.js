import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const main = searchParams.get("main");
  const sub = searchParams.get("sub");
  const exclude = searchParams.get("exclude");

  if (!main) return new Response(JSON.stringify([]), { status: 200 });

  const query = { mainCategory: main };
  if (sub) query.subcategory = sub; // ✅ filter by subcategory if present
  if (exclude) query._id = { $ne: exclude }; // ✅ exclude current product

  const products = await Product.find(query).limit(8); // max 8 related
  return new Response(JSON.stringify(products), { status: 200 });
}
