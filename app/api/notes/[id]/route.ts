import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Note } from "@/models/Note"
import { verifyToken } from "@/lib/jwt"

async function authenticate(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) return null

  const decoded = verifyToken(token)
  return decoded?.userId || null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticate(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params

    const note = await Note.findOne({
      _id: id,
      owner: userId,
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ note }, { status: 200 })
  } catch (error) {
    console.error("Fetch note error:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticate(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const { title, content, isArchived } = await req.json()

    // Verify ownership
    const note = await Note.findOne({
      _id: id,
      owner: userId,
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Update note
    if (title !== undefined) note.title = title
    if (content !== undefined) note.content = content
    if (isArchived !== undefined) note.isArchived = isArchived

    await note.save()

    return NextResponse.json({ message: "Note updated", note }, { status: 200 })
  } catch (error) {
    console.error("Update note error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticate(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params

    // Verify ownership before deletion
    const note = await Note.findOne({
      _id: id,
      owner: userId,
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    await Note.deleteOne({ _id: id })

    return NextResponse.json({ message: "Note deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete note error:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
