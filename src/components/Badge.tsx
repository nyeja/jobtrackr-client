import type { ReactNode } from 'react'
import type { ApplicationStatus } from '@/types/application'
import { STATUS_LABELS } from '@/constants/status'
import { cn } from '@/utils/cn'

const styles: Record<ApplicationStatus, string> = {
  to_send:
    'border-zinc-200/80 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200',
  sent: 'border-sky-200/80 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100',
  interview:
    'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
  rejected:
    'border-rose-200/80 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
  accepted:
    'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide',
        styles[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
        className,
      )}
    >
      {children}
    </span>
  )
}
