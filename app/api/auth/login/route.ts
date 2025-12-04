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

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password")

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString())

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          email: user.email,
        },
        token,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
