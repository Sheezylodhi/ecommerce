import {connectDB} from "@/lib/db";
import {Product} from "@/lib/models/Product";
import { Order} from "@/lib/models/Order";

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find({}).lean();
    const orders = await Order.find({ paymentStatus: "paid" }).lean();

    const report = products.map((p) => {
      let totalQuantity = 0;
      let totalEarning = 0;

      orders.forEach((o) => {
        // Ensure correct field name inside each order
        const items = o.items || o.cartItems || o.orderItems || [];
        const item = items.find(
          (i) => i.productId?.toString() === p._id.toString()
        );
        if (item) {
          totalQuantity += item.quantity;
          totalEarning += item.quantity * (item.price || p.price || 0);
        }
      });

      return {
        productId: p._id,
        name: p.name,
        image: p.image || "",
        totalQuantity,
        totalEarning,
      };
    });

    const overallEarning = report.reduce(
      (sum, p) => sum + p.totalEarning,
      0
    );

    return Response.json({ report, overallEarning });
  } catch (err) {
    console.error("Reports error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
