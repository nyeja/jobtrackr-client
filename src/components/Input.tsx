import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500',
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-500/50 dark:focus:border-rose-400 dark:focus:ring-rose-500/20'
            : 'border-zinc-200/80 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-800 dark:focus:border-violet-500 dark:focus:ring-violet-500/20',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  )
})
