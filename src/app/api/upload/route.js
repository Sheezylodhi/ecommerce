import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs-extra";
import path from "path";

// Disable body parsing so formidable can handle it
export const config = {
  api: { bodyParser: false },
};

// helper function to convert Web Request to Node.js compatible
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export async function POST(req) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.ensureDir(uploadDir);

    // Convert Web Request to Node.js IncomingMessage
    const nodeReq = req.body ? req : req;
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          return resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
        }

        if (!files.image) return resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));

        const f = Array.isArray(files.image) ? files.image[0] : files.image;
        const relPath = "/uploads/" + path.basename(f.filepath);

        console.log("File uploaded:", relPath);
        resolve(NextResponse.json({ success: true, url: relPath }));
      });
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
