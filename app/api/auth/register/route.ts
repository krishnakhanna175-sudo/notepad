import { connectDB } from "@/lib/mongodb"
import { generateToken } from "@/lib/jwt"
import { User } from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
    })

    await newUser.save()

    // Generate token
    const token = generateToken(newUser._id.toString())

    return NextResponse.json(
      {
        user: {
          _id: newUser._id,
          email: newUser.email,
        },
        token,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
