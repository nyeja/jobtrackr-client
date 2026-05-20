import { motion } from 'framer-motion'
import type { ApplicationStatus } from '@/types/application'
import { STATUS_LABELS } from '@/constants/status'
import { Card } from '@/components/Card'
import { cn } from '@/utils/cn'

const ORDER: ApplicationStatus[] = [
  'to_send',
  'sent',
  'interview',
  'rejected',
  'accepted',
]

const barColors: Record<ApplicationStatus, string> = {
  to_send: 'from-zinc-400 to-zinc-500',
  sent: 'from-sky-400 to-sky-600',
  interview: 'from-amber-400 to-amber-600',
  rejected: 'from-rose-400 to-rose-600',
  accepted: 'from-emerald-400 to-emerald-600',
}

const dotColors: Record<ApplicationStatus, string> = {
  to_send: 'bg-zinc-500',
  sent: 'bg-sky-500',
  interview: 'bg-amber-500',
  rejected: 'bg-rose-500',
  accepted: 'bg-emerald-500',
}

export function JobStatusChart({
  counts,
  className,
}: {
  counts: Record<ApplicationStatus, number>
  className?: string
}) {
  const total = ORDER.reduce((s, k) => s + counts[k], 0) || 1

  return (
    <Card className={cn(className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Candidatures par statut
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Répartition actuelle de votre pipeline
          </p>
        </div>
        <div className="rounded-full border border-zinc-200/80 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Total {total}
        </div>
      </div>

      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/80">
        {ORDER.map((key) => {
          const pct = (counts[key] / total) * 100
          if (pct <= 0) return null
          return (
            <motion.div
              key={key}
              layout
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className={cn('h-full bg-gradient-to-r', barColors[key])}
              title={`${STATUS_LABELS[key]} : ${counts[key]}`}
            />
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ORDER.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            <div className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', dotColors[key])} />
              <span className="text-sm text-zinc-700 dark:text-zinc-200">{STATUS_LABELS[key]}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-white">
              {counts[key]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
