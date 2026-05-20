import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'jobtrackr_user'

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser())

  const persist = useCallback((next: User | null) => {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
    setUser(next)
  }, [])

  const login = useCallback(
    (email: string, _password: string) => {
      void _password
      const name = email.split('@')[0]?.replace(/\./g, ' ') ?? 'Utilisateur'
      persist({
        id: crypto.randomUUID(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
      })
    },
    [persist],
  )

  const register = useCallback(
    (name: string, email: string, _password: string) => {
      void _password
      persist({
        id: crypto.randomUUID(),
        name,
        email,
      })
    },
    [persist],
  )

  const logout = useCallback(() => {
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
