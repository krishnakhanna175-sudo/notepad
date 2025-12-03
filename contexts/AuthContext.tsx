"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") return

      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser) as User)
          } catch (e) {
            console.error("Failed to parse stored user:", e)
            try {
              localStorage.removeItem("user")
            } catch (cleanupError) {
              console.error("Failed to remove corrupted user data:", cleanupError)
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to initialize auth:", e)
    } finally {
      setIsMounted(true)
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = "Login failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error("Failed to parse error response:", e)
        }
        throw new Error(errorMessage)
      }

      const data = (await response.json()) as { token: string; user: User }
      setToken(data.token)
      setUser(data.user)
      
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
        } catch (e) {
          console.error("Failed to persist auth data:", e)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      console.error("Login error:", message)
      setToken(null)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = "Registration failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error("Failed to parse error response:", e)
        }
        throw new Error(errorMessage)
      }

      const data = (await response.json()) as { token: string; user: User }
      setToken(data.token)
      setUser(data.user)
      
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
        } catch (e) {
          console.error("Failed to persist auth data:", e)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed"
      console.error("Register error:", message)
      setToken(null)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch (e) {
        console.error("Failed to clear localStorage:", e)
      }
    }
  }

  if (!isMounted) {
    // Return a loading state during SSR and initial hydration
    return (
      <AuthContext.Provider value={{ user: null, token: null, isLoading: true, login, register, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
