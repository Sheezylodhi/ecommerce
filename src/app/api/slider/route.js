import { connectDB } from "@/lib/db";
import { Slider } from "@/lib/models/Slider";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const slides = await Slider.find({}).sort({ order: 1 });
    return res.status(200).json(slides);
  }

  res.status(405).json({ message: "Method not allowed" });
}
