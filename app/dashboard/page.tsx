"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useNotes } from "@/hooks/useNotes"
import { Navbar } from "@/components/Navbar"
import { NoteCard } from "@/components/NoteCard"
import { NoteEditor } from "@/components/NoteEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { notes, isLoading, fetchNotes, createNote, updateNote, deleteNote } = useNotes()
  const [editingNote, setEditingNote] = useState<any>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  // Fetch notes when authenticated
  useEffect(() => {
    if (!authLoading && user) {
      fetchNotes()
    }
  }, [authLoading, user, fetchNotes])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredNotes = notes
    .filter((note) => (showArchived ? note.isArchived : !note.isArchived))
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const handleSaveNote = async (title: string, content: string) => {
    try {
      if (editingNote) {
        await updateNote(editingNote._id, title, content, editingNote.isArchived)
      } else {
        await createNote(title, content)
      }
      setShowEditor(false)
      setEditingNote(null)
    } catch (error) {
      alert("Failed to save note")
    }
  }

  const handleEdit = (note: any) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleNewNote = () => {
    setEditingNote(null)
    setShowEditor(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Your Notes</h2>
            <p className="text-muted-foreground">Manage your secure notes</p>
          </div>
          <Button onClick={handleNewNote} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant={showArchived ? "default" : "outline"} onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Archived" : "Active"}
          </Button>
        </div>

        {/* Notes grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No notes match your search" : "No notes yet. Create one to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} onEdit={handleEdit} onDelete={deleteNote} onArchive={updateNote} />
            ))}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowEditor(false)
            setEditingNote(null)
          }}
        />
      )}
    </div>
  )
}
