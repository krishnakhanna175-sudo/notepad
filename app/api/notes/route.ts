import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Note } from "@/models/Note"
import { verifyToken } from "@/lib/jwt"
import mongoose from "mongoose"

async function authenticate(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) return null

  const decoded = verifyToken(token)
  return decoded?.userId || null
}

export async function GET(req: NextRequest) {
  try {
    const userId = await authenticate(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get notes belonging to the authenticated user
    const notes = await Note.find({ owner: userId }).sort({ createdAt: -1 })

    return NextResponse.json({ notes }, { status: 200 })
  } catch (error) {
    console.error("Fetch notes error:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await authenticate(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { title, content } = await req.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const note = await Note.create({
      title,
      content: content || "",
      owner: new mongoose.Types.ObjectId(userId),
    })

    return NextResponse.json({ message: "Note created", note }, { status: 201 })
  } catch (error) {
    console.error("Create note error:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
