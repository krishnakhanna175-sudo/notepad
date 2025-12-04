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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
    })

    // Generate token
    const token = generateToken(newUser._id.toString())

    // Return success response
    return NextResponse.json(
      {
        token,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)

    const message = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
