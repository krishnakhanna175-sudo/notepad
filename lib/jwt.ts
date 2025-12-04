import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"
const JWT_EXPIRY = "7d"

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token) as { userId: string; iat: number; exp: number }
  } catch (error) {
    return null
  }
}
