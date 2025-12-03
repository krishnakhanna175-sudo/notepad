"use client"

import { useState } from "react"

function NoteCard({ note, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true)
      await onDelete(note._id)
      setIsDeleting(false)
    }
  }

  return (
    <div className="card-hover group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 flex-1 truncate">{note.title}</h3>
        <button
          onClick={() => onEdit(note)}
          className="ml-2 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
        >
          Edit
        </button>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{truncateText(note.content)}</p>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
}

export default NoteCard
