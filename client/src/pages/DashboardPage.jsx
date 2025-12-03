"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import NoteCard from "../components/NoteCard"
import NoteEditor from "../components/NoteEditor"
import api from "../utils/api"
import { removeToken } from "../utils/auth"

function DashboardPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await api.get("/notes")
      setNotes(response.data)
      setError("")
    } catch (err) {
      setError("Failed to load notes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewNote = () => {
    setSelectedNote(null)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note) => {
    setSelectedNote(note)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (noteData) => {
    setIsSaving(true)

    try {
      if (selectedNote) {
        // Update existing note
        await api.put(`/notes/${selectedNote._id}`, noteData)
      } else {
        // Create new note
        await api.post("/notes", noteData)
      }

      await fetchNotes()
      setIsEditorOpen(false)
      setSelectedNote(null)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`)
      await fetchNotes()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note")
    }
  }

  const handleLogout = () => {
    removeToken()
    navigate("/login")
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">SecureNotePad</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {/* Search and New Note Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleNewNote} className="btn-primary whitespace-nowrap">
            + New Note
          </button>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-500 text-lg">Loading notes...</div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-slate-500 text-lg mb-4">
              {searchQuery ? "No notes found matching your search" : "No notes yet"}
            </div>
            {!searchQuery && (
              <button onClick={handleNewNote} className="btn-primary">
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteNote} />
            ))}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setIsEditorOpen(false)
            setSelectedNote(null)
          }}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

export default DashboardPage
