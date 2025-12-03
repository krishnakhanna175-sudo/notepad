import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Create a new request with userId attached
    const requestWithUser = req
    ;(requestWithUser as any).userId = decoded.userId

    return handler(requestWithUser, decoded.userId)
  }
}
