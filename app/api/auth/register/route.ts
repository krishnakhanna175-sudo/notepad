import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { generateToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    console.log("Register endpoint called")
    await connectDB()
    console.log("Database connected")
    
    const { email, password } = await req.json()
    console.log("Register attempt for email:", email)

    // Validate input
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email and password (min 6 characters) are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
    })
    console.log("User created:", user._id)

    // Generate JWT token
    const token = generateToken(user._id.toString())

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: { id: user._id.toString(), email: user.email },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Register error:", error)
    const errorMessage = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
