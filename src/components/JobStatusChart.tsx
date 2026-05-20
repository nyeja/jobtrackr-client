import { motion } from 'framer-motion'
import { APPLICATION_STATUSES } from '@/constants/status'
import type { ApplicationStatus } from '@/types/application'
import { Card } from '@/components/Card'
import { cn } from '@/utils/cn'
import { STATUS_BADGE_CLASS } from '@/constants/status'

export function JobStatusChart({
  counts,
  className,
}: {
  counts: Record<ApplicationStatus, number>
  className?: string
}) {
  const total = APPLICATION_STATUSES.reduce((s, k) => s + (counts[k] ?? 0), 0) || 1

  return (
    <Card className={cn(className)}>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Candidatures par statut
          </h3>
          <p className="mt-1 text-sm text-zinc-500">Données MongoDB</p>
        </div>
        <span className="rounded-full border px-3 py-1 text-xs font-medium">Total {total}</span>
      </div>
      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        {APPLICATION_STATUSES.map((key) => {
          const pct = ((counts[key] ?? 0) / total) * 100
          if (pct <= 0) return null
          return (
            <motion.div
              key={key}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              className={cn('h-full', STATUS_BADGE_CLASS[key].includes('sky') ? 'bg-sky-500' : 'bg-violet-500')}
            />
          )
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {APPLICATION_STATUSES.map((key) => (
          <div
            key={key}
            className="flex justify-between rounded-xl border border-zinc-100 px-3 py-2.5 dark:border-zinc-800"
          >
            <span className="text-sm">{key}</span>
            <span className="font-semibold tabular-nums">{counts[key] ?? 0}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
