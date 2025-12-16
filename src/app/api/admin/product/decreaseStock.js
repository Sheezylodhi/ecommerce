import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

export async function POST(req) {
  try {
    await connectDB();
    const { productId, color, size, quantity } = await req.json();
    const product = await Product.findById(productId);
    if (!product) return new Response("Product not found", { status: 404 });

    const variant = product.variants.find(v => v.color === color);
    const sizeObj = variant.sizes.find(s => s.size === size);

    if (sizeObj.stock < quantity) return new Response("Not enough stock", { status: 400 });

    sizeObj.stock -= quantity;
    await product.save();

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
