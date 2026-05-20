import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader } from '@/components/Loader'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[var(--color-surface)] dark:bg-zinc-950">
        <Loader label="Vérification de la session…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[var(--color-surface)] dark:bg-zinc-950">
        <Loader label="Chargement…" />
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function RootRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}
