import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Address } from "@/lib/models/Address";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newAddress = await Address.create({
    ...body,
    email: session.user.email, // 🔥 MUST
  });

  return NextResponse.json({ success: true, address: newAddress });
}

