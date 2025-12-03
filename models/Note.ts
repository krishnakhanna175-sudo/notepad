import mongoose, { Schema, type Document } from "mongoose"

export interface INote extends Document {
  title: string
  content: string
  owner: mongoose.Types.ObjectId
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: 200,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Note = mongoose.models.Note || mongoose.model<INote>("Note", noteSchema)
