"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Archive, Trash2, Edit } from "lucide-react"

interface NoteCardProps {
  note: {
    _id: string
    title: string
    content: string
    isArchived: boolean
  }
  onEdit: (note: any) => void
  onDelete: (id: string) => void
  onArchive: (id: string, title: string, content: string, isArchived: boolean) => void
}

export function NoteCard({ note, onEdit, onDelete, onArchive }: NoteCardProps) {
  const truncatedContent = note.content.substring(0, 100).replace(/\n/g, " ")

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
        <CardDescription className="line-clamp-2">{truncatedContent}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(note)}
          className="flex-1 flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onArchive(note._id, note.title, note.content, !note.isArchived)}
          className="flex items-center gap-2"
        >
          <Archive className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm("Delete this note?")) {
              onDelete(note._id)
            }
          }}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
