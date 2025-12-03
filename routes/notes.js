import express from "express"
import Note from "../models/Note.js"

const router = express.Router()

// GET /api/notes - Get all notes for the authenticated user
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error: error.message })
  }
})

// GET /api/notes/:id - Get a specific note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // Security check: ensure note belongs to authenticated user
    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    res.json(note)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note", error: error.message })
  }
})

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    const note = new Note({
      title,
      content,
      owner: req.userId,
    })

    await note.save()
    res.status(201).json(note)
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error: error.message })
  }
})

// PUT /api/notes/:id - Update a note
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // Security check: ensure note belongs to authenticated user
    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    const { title, content, isArchived } = req.body

    if (title !== undefined) note.title = title
    if (content !== undefined) note.content = content
    if (isArchived !== undefined) note.isArchived = isArchived

    await note.save()
    res.json(note)
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error: error.message })
  }
})

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // Security check: ensure note belongs to authenticated user
    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    await Note.deleteOne({ _id: req.params.id })
    res.json({ message: "Note deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message })
  }
})

export default router
