import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface CardProps {
  hover?: boolean
  className?: string
  children: ReactNode
}

export function Card({ className, hover = false, children }: CardProps) {
  return (
    <motion.div
      initial={false}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'rounded-2xl border border-zinc-200/70 bg-white/80 p-5 shadow-[0_1px_0_rgba(9,9,11,0.04),0_8px_24px_-12px_rgba(9,9,11,0.12)] backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_40px_-16px_rgba(0,0,0,0.55)]',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
