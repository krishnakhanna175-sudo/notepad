import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/securenotepad"

if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
  console.warn("Warning: MONGODB_URI not set, using default localhost connection")
}

// Singleton connection pattern to prevent multiple connections
let cached = global.mongoose as any

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    }).catch((error) => {
      console.error("MongoDB connection error:", error.message)
      throw error
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
