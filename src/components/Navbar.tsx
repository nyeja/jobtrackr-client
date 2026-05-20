import { Menu, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'

export function Navbar({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string
  subtitle?: string
  onMenuClick: () => void
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnexion réussie')
    navigate('/login', { replace: true })
  }
  const initials =
    user?.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'JT'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200/80 bg-white/85 px-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 lg:hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.name}</p>
          <p className="max-w-[200px] truncate text-xs text-zinc-500 dark:text-zinc-400">
            {user?.email}
          </p>
        </div>
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50 text-sm font-semibold text-zinc-800 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-100',
          )}
          title={user?.name}
        >
          {initials}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => void handleLogout()}
          aria-label="Se déconnecter"
        >
          <LogOut className="size-4" />
          <span className="hidden md:inline">Déconnexion</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden"
          onClick={() => void handleLogout()}
          aria-label="Se déconnecter"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
