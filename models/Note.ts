import mongoose, { Document, Schema } from "mongoose"

interface INote extends Document {
  userId: string
  title: string
  content: string
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Note",
    },
    content: {
      type: String,
      default: "",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const Note = mongoose.models.Note || mongoose.model<INote>("Note", noteSchema)
