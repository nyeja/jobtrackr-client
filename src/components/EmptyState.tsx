import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200/90 bg-zinc-50/50 px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/40',
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Icon className="size-6 text-zinc-500 dark:text-zinc-400" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  )
}
