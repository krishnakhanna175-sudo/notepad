"use client"

import { createContext, useContext, useState, useEffect, ReactNode, FC, PropsWithChildren } from "react"

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

// Provide default implementation
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error("Auth context not initialized - useAuth must be used within AuthProvider")
  },
  register: async () => {
    throw new Error("Auth context not initialized - useAuth must be used within AuthProvider")
  },
  logout: () => {
    throw new Error("Auth context not initialized - useAuth must be used within AuthProvider")
  },
}

// Create context with default value
const AuthContext = createContext<AuthContextType>(defaultAuthContext)

// Auth Provider Component
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
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
      try {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      } catch (e) {
        console.error("Failed to clear localStorage:", e)
      }
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

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
        let errorMessage = "Login failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      let data: AuthResponse
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error("Invalid response from server")
      }

      // Store auth data
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("authToken", data.token)
          localStorage.setItem("authUser", JSON.stringify(data.user))
        } catch (storageError) {
          console.error("Failed to persist auth data:", storageError)
        }
      }
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

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
        let errorMessage = "Registration failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      let data: AuthResponse
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error("Invalid response from server")
      }

      // Store auth data
      setToken(data.token)
      setUser(data.user)

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("authToken", data.token)
          localStorage.setItem("authUser", JSON.stringify(data.user))
        } catch (storageError) {
          console.error("Failed to persist auth data:", storageError)
        }
      }
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = (): void => {
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
