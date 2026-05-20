import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import { cn } from '@/utils/cn'

export interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  trend?: number[]
  className?: string
}

export function StatCard({ label, value, icon: Icon, hint, trend, className }: StatCardProps) {
  const max = Math.max(...(trend ?? [1]), 1)
  return (
    <Card hover className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-white">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
          ) : null}
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          <Icon className="size-5" />
        </div>
      </div>
      {trend && trend.length > 0 ? (
        <div className="mt-5 flex h-10 items-end gap-1">
          {trend.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ type: 'spring', stiffness: 320, damping: 24, delay: i * 0.03 }}
              className="w-1.5 min-h-[6px] rounded-full bg-gradient-to-t from-violet-600/20 to-violet-600 dark:from-violet-400/25 dark:to-violet-400"
            />
          ))}
        </div>
      ) : null}
    </Card>
  )
}
