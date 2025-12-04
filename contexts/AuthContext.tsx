"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  PropsWithChildren,
} from "react"

export interface User {
  _id: string
  email: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {
    throw new Error("Login service not available")
  },
  register: async () => {
    throw new Error("Registration service not available")
  },
  logout: () => {
    throw new Error("Logout service not available")
  },
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

interface AuthResponse {
  user: User
  token: string
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const storedToken = localStorage.getItem("authToken")
      const storedUser = localStorage.getItem("authUser")

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error)
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearAuth = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      } catch (error) {
        console.error("Failed to clear auth storage:", error)
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
