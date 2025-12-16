import { NextResponse } from "next/server";
import { Slider } from "@/lib/models/Slider";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await connectDB();

  // Receive FormData
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) return NextResponse.json({ error: "No file found" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Public uploads folder
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  // Save to MongoDB
  await Slider.create({
    image: fileName,
    title: formData.get("title") || "",
    order: formData.get("order") || 0,
  });

  return NextResponse.json({ success: true, file: fileName });
}
