import jwt from "jsonwebtoken"

// Fallback to a default secret if not set (for development only)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("Warning: JWT_SECRET not set in environment variables")
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}
