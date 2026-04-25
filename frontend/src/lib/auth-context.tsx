'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import apiClient, { setAccessToken, getAccessToken, clearTokens } from './api/client'

interface User {
  id: string
  username: string
  email: string
  displayName: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: boolean
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await apiClient.post('/auth/refresh', {}, { withCredentials: true })
        setAccessToken(data.data.accessToken)
        const profileRes = await apiClient.get('/users/me')
        setUser(profileRes.data.data)
      } catch {
        clearTokens()
      } finally {
        setIsInitializing(false)
      }
    }
    init()
  }, [])

  const logout = () => {
    clearTokens()
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = !!user && !!getAccessToken()

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated, isInitializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
