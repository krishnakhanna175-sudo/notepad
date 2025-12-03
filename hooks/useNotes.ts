"use client"

import { useState, useCallback, useEffect } from "react"
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
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchNotes = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }

      const data = await response.json()
      setNotes(data.notes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const createNote = useCallback(
    async (title: string, content = "") => {
      if (!token) return

      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        })

        if (!response.ok) {
          throw new Error("Failed to create note")
        }

        const data = await response.json()
        setNotes((prev) => [data.note, ...prev])
        return data.note
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to create note")
      }
    },
    [token],
  )

  const updateNote = useCallback(
    async (id: string, title: string, content: string, isArchived = false) => {
      if (!token) return

      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, isArchived }),
        })

        if (!response.ok) {
          throw new Error("Failed to update note")
        }

        const data = await response.json()
        setNotes((prev) => prev.map((note) => (note._id === id ? data.note : note)))
        return data.note
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to update note")
      }
    },
    [token],
  )

  const deleteNote = useCallback(
    async (id: string) => {
      if (!token) return

      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to delete note")
        }

        setNotes((prev) => prev.filter((note) => note._id !== id))
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to delete note")
      }
    },
    [token],
  )

  // Fetch notes on mount or when token changes
  useEffect(() => {
    if (token) {
      fetchNotes()
    }
  }, [token, fetchNotes])

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}
