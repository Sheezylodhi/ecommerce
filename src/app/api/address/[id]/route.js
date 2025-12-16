import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Address } from "@/lib/models/Address";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const body = await req.json();

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: params.id, userId: decoded.id },
    body,
    { new: true }
  );

  return NextResponse.json({ success: true, address: updatedAddress });
}
