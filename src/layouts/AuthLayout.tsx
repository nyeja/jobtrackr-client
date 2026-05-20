import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

function AuthIllustration() {
  return (
    <div className="relative hidden h-full min-h-[480px] overflow-hidden rounded-3xl border border-zinc-200/70 bg-gradient-to-br from-zinc-50 via-white to-violet-50/80 p-8 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-violet-950/30 lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.12), transparent 35%)',
        }}
      />
      <div className="relative">
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-900">
          JT
        </div>
        <h2 className="max-w-sm text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Pilotez vos candidatures avec clarté.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          JobTrackr centralise vos opportunités, statuts et notes — une expérience sobre inspirée des
          meilleurs dashboards SaaS.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="relative mt-8 space-y-3"
      >
        {[
          { company: 'Vercel', role: 'Product Designer', status: 'Entretien' },
          { company: 'Stripe', role: 'Developer Advocate', status: 'Acceptée' },
          { company: 'Figma', role: 'Design Engineer', status: 'À envoyer' },
        ].map((row, i) => (
          <motion.div
            key={row.company}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{row.company}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{row.role}</p>
            </div>
            <span className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {row.status}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-violet-200/50 dark:border-violet-500/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-violet-500/5 blur-2xl"
        aria-hidden
      />
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="min-h-svh bg-[var(--color-surface)] dark:bg-zinc-950">
      <div className="mx-auto grid min-h-svh max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-start"
        >
          <Outlet />
        </motion.div>
        <AuthIllustration />
      </div>
    </div>
  )
}
