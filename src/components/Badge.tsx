import type { ApplicationStatus } from '@/types/application'
import { STATUS_BADGE_CLASS, STATUS_LABELS } from '@/constants/status'
import { cn } from '@/utils/cn'

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
        STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
