// Test script to verify MongoDB connection
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/securenotepad"

console.log("Testing MongoDB connection...")
console.log("URI:", MONGO_URI.replace(/:[^:]*@/, ":****@")) // Hide password

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!")
    console.log("Mongoose version:", mongoose.version)
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message)
    console.error("Full error:", error)
    process.exit(1)
  })
