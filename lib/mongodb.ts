import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Singleton connection pattern to prevent multiple connections
let cached = global.mongoose

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
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
