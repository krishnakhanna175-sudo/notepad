"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// User type
interface AuthUser {
  id: string
  email: string
}

// Auth response from API
interface AuthResponse {
  token: string
  user: AuthUser
}

// Context type
interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === "undefined") return

        const storedToken = localStorage.getItem("authToken")
        const storedUser = localStorage.getItem("authUser")

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setToken(storedToken)
            setUser(parsedUser)
          } catch (error) {
            console.error("Failed to parse stored user:", error)
            clearAuth()
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Clear auth data
  const clearAuth = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data: AuthResponse = await response.json()

      // Store auth data
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("authUser", JSON.stringify(data.user))
      }
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const data: AuthResponse = await response.json()

      // Store auth data
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("authUser", JSON.stringify(data.user))
      }
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    clearAuth()
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
