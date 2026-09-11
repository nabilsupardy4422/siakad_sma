import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginRequest, logoutRequest } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'siakad_token'
const USER_KEY = 'siakad_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY)

    try {
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  })
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsInitializing(false)
        return
      }

      try {
        const data = await getCurrentUser(token)
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setIsInitializing(false)
      }
    }

    restoreSession()
  }, [token])

  const login = async (email, password) => {
    const data = await loginRequest(email, password)

    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)

    return data.user
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest(token)
      }
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setToken(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
    }),
    [token, user, isInitializing],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider.')
  }

  return context
}