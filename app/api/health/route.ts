import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        mongodb: "connected",
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
