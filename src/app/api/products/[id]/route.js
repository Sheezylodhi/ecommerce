import {connectDB} from "@/lib/db";
import {Product} from "@/lib/models/Product";

export async function GET(req, { params: promiseParams }) {
  try {
    // ✅ unwrap params
    const params = await promiseParams;
    const { id } = params;

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error("GET product error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
