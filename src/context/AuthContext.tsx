import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setUnauthorizedHandler } from '@/lib/api'
import { getAccessToken, clearAccessToken, clearLegacyStorage } from '@/lib/tokenStorage'
import { isTokenExpired } from '@/lib/jwt'
import * as authService from '@/services/authService'
import type { User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export { getApiErrorMessage } from '@/lib/api'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    clearAccessToken()
    clearLegacyStorage()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession())
    const onLogout = () => clearSession()
    window.addEventListener('jobtrackr:logout', onLogout)
    return () => window.removeEventListener('jobtrackr:logout', onLogout)
  }, [clearSession])

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const token = getAccessToken()
      if (!token || isTokenExpired(token)) {
        clearSession()
        if (!cancelled) setIsLoading(false)
        return
      }
      try {
        const me = await authService.fetchMe()
        if (!cancelled) setUser(me)
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void restore()
    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      const { user: u } = await authService.loginRequest(email, password, rememberMe)
      setUser(u)
    },
    [],
  )

  const register = useCallback(
    async (name: string, email: string, password: string, rememberMe = false) => {
      const { user: u } = await authService.registerRequest(name, email, password, rememberMe)
      setUser(u)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) await authService.logoutRequest()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const refreshUser = useCallback(async () => {
    const me = await authService.fetchMe()
    setUser(me)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
