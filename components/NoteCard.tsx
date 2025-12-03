"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Archive } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  note: {
    _id: string
    title: string
    content: string
    isArchived: boolean
    createdAt: string
  }
  onEdit: (note: any) => void
  onDelete: (id: string) => void
  onArchive: (id: string, isArchived: boolean) => void
}

export function NoteCard({ note, onEdit, onDelete, onArchive }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true)
      try {
        await onDelete(note._id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const preview = note.content.substring(0, 150).replace(/\n/g, " ")

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{note.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{preview || "No content"}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(note)} title="Edit note">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(note._id, !note.isArchived)}
              title={note.isArchived ? "Unarchive" : "Archive"}
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
