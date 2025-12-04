import { connectDB } from "@/lib/mongodb"
import { verifyToken } from "@/lib/jwt"
import { Note } from "@/models/Note"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Fetch user's notes
    const notes = await Note.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    })

    return NextResponse.json({ notes }, { status: 200 })
  } catch (error: any) {
    console.error("Fetch notes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, content } = await request.json()

    // Create note
    const note = new Note({
      userId: decoded.userId,
      title: title || "Untitled Note",
      content: content || "",
    })

    await note.save()

    return NextResponse.json({ note }, { status: 201 })
  } catch (error: any) {
    console.error("Create note error:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}
