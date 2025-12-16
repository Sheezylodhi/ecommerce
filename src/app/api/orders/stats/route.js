import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find();

  // Sales by month
  const monthlySales = {};
  const statusCounts = { delivered: 0, pending: 0, cancelled: 0 };

  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    monthlySales[month] = (monthlySales[month] || 0) + order.total;

    if (order.status === "delivered") statusCounts.delivered++;
    if (order.status === "pending") statusCounts.pending++;
    if (order.status === "cancelled") statusCounts.cancelled++;
  });

  return new Response(
    JSON.stringify({
      monthlySales,
      statusCounts,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
    }),
    { status: 200 }
  );
}
