import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ orders: [] }, { status: 401 });
  }

  const orders = await Order.find({
    email: session.user.email, // ✅ MATCH GUARANTEED
  }).sort({ createdAt: -1 });

  return Response.json({ orders });
}
