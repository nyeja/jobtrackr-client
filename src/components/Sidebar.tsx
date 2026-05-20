import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, LayoutDashboard, LineChart, Settings2, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Candidatures', icon: Briefcase },
  { to: '/statistics', label: 'Statistiques', icon: LineChart },
  { to: '/settings', label: 'Paramètres', icon: Settings2 },
] as const

function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold tracking-tight text-white shadow-sm dark:bg-white dark:text-zinc-900">
        JT
      </div>
      {!collapsed ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">JobTrackr</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Suivi des candidatures</p>
        </div>
      ) : null}
    </div>
  )
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70 lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-zinc-100 px-5 dark:border-zinc-800">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-[18px] opacity-90" />
                  <span>{label}</span>
                  {isActive ? (
                    <span className="ml-auto hidden size-1.5 rounded-full bg-violet-400 lg:block dark:bg-violet-600" />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
            JobTrackr est une démo frontend — données simulées localement.
          </p>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
              aria-label="Fermer le menu"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="absolute left-0 top-0 flex h-full w-[min(88vw,280px)] flex-col border-r border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-4 dark:border-zinc-800">
                <Logo />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 p-3">
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80',
                      )
                    }
                  >
                    <Icon className="size-[18px]" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
