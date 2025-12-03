import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { generateToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    console.log("Login endpoint called")
    await connectDB()
    console.log("Database connected")
    
    const { email, password } = await req.json()
    console.log("Login attempt for email:", email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user and include password field (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user._id.toString())
    console.log("User logged in:", user._id)

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    const errorMessage = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
