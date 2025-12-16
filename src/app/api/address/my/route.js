import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Address } from "@/lib/models/Address";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ addresses: [] });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const addresses = await Address.find({ userId: decoded.id });
  return NextResponse.json({ addresses });
}
