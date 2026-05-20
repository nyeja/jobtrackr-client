import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
  secondary:
    'border border-zinc-200/80 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
  ghost:
    'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white',
  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-500/40',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, disabled, children, ...props },
  ref,
) {
  const isDisabled = disabled || loading

  return (
    <motion.span
      className="inline-flex"
      whileHover={{ scale: isDisabled ? 1 : 1.01 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] dark:focus-visible:ring-offset-zinc-950',
          variants[variant],
          sizes[size],
          isDisabled && 'pointer-events-none opacity-50',
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            <span>Chargement…</span>
          </span>
        ) : (
          children
        )}
      </button>
    </motion.span>
  )
})
