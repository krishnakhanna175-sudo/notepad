"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Note {
  _id: string
  title: string
  content: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export function useNotes() {
  const { token } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotes = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch notes")
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const createNote = useCallback(
    async (title: string, content: string) => {
      if (!token) throw new Error("Not authenticated")

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) throw new Error("Failed to create note")
      const data = await response.json()

      setNotes([data.note, ...notes])
      return data.note
    },
    [token, notes]
  )

  const updateNote = useCallback(
    async (
      id: string,
      title: string,
      content: string,
      isArchived: boolean
    ) => {
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, isArchived }),
      })

      if (!response.ok) throw new Error("Failed to update note")
      const data = await response.json()

      setNotes(
        notes.map((note) =>
          note._id === id
            ? {
                ...note,
                title: data.note.title,
                content: data.note.content,
                isArchived: data.note.isArchived,
              }
            : note
        )
      )
      return data.note
    },
    [token, notes]
  )

  const deleteNote = useCallback(
    async (id: string) => {
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete note")

      setNotes(notes.filter((note) => note._id !== id))
    },
    [token, notes]
  )

  return {
    notes,
    isLoading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}
