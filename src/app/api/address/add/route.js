import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Address } from "@/lib/models/Address";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const body = await req.json();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Address.create({
      userId: decoded.id,
        email: session.user.email,
      ...body,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}
