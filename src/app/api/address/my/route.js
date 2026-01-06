import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Address } from "@/lib/models/Address";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ addresses: [] }, { status: 401 });
  }

  const addresses = await Address.find({
    email: session.user.email, // ✅ MATCH
  }).sort({ createdAt: -1 });

  return Response.json({ addresses });
}
