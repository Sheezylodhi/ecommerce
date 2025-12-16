// src/middleware/adminAuth.js
import jwt from "jsonwebtoken";

export function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, username }
  } catch (err) {
    return null;
  }
}
