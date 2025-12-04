import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Return success response
    return NextResponse.json(
      {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)

    const message = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
